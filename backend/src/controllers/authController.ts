import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import prisma from "../config/prisma"
import { generateTokens, setCookies, clearCookies } from "../utils/jwt"
import { Role } from "@prisma/client"
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/email"

// ------------------------ REGISTER ------------------------
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role || Role.STUDENT,
        isEmailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      },
    })

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, user.name, verificationToken).catch((emailError) => {
      console.error("Failed to send verification email:", emailError.message || emailError)
    })

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

// ------------------------ VERIFY EMAIL ------------------------
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query

    if (!token || typeof token !== "string") {
      return res.status(400).json({ success: false, message: "Invalid verification token" })
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      })
    }

    // Check if already verified (Handle double-clicks/prefetches)
    if (user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "Email is already verified. You can log in.",
      })
    }

    // Check if token is expired
    if (user.emailVerificationTokenExpiry && user.emailVerificationTokenExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification token has expired. Please request a new one.",
      })
    }

    // Mark email as verified but KEEP the token for a while (or indefinitely until re-issued)
    // This allows the user to refresh the success page without getting an error
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        // Do NOT clear token immediately to prevent "Invalid Token" on refresh
        // emailVerificationToken: null, 
        // emailVerificationTokenExpiry: null,
      },
    })

    // Send welcome email after verification (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch((emailError) => {
      console.error("Failed to send welcome email:", emailError.message || emailError)
    })

    return res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    })
  } catch (err) {
    next(err)
  }
}

// ------------------------ RESEND VERIFICATION EMAIL ------------------------
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Don't reveal if user exists
      return res.json({ success: true, message: "If an account exists with this email, a verification link has been sent." })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" })
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: tokenExpiry,
      },
    })

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, user.name, verificationToken).catch((emailError) => {
      console.error("Failed to send verification email:", emailError.message || emailError)
    })

    return res.json({
      success: true,
      message: "If an account exists with this email, a verification link has been sent.",
    })
  } catch (err) {
    next(err)
  }
}

// ------------------------ LOGIN ------------------------
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        code: "EMAIL_NOT_VERIFIED",
      })
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)
    setCookies(res, accessToken, refreshToken)

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
}

// ------------------------ LOGOUT ------------------------
export const logout = (req: Request, res: Response) => {
  clearCookies(res)
  return res.json({ success: true, message: "Logged out successfully" })
}

// ------------------------ REFRESH TOKEN ------------------------
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken

    if (!token) {
      clearCookies(res)
      return res.status(401).json({ success: false, message: "No refresh token" })
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string)
    } catch (err) {
      clearCookies(res)
      return res.status(401).json({ success: false, message: "Invalid refresh token" })
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) {
      clearCookies(res)
      return res.status(401).json({ success: false, message: "User not found" })
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)
    setCookies(res, accessToken, refreshToken)

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err) {
    clearCookies(res)
    return res.status(401).json({ success: false, message: "Invalid refresh token" })
  }
}

// ------------------------ GET CURRENT USER ------------------------
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        educationLevel: true,
        careerFocusId: true,
        onboardingCompleted: true,
        interestedCareerPath: {
          select: {
            id: true,
            title: true,
          }
        },
      },
    })

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.json({ success: true, data: user })
  } catch (err) {
    next(err)
  }
}
