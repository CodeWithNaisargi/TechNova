import { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma"
import { generateTokens, setCookies, clearCookies } from "../utils/jwt"
import { Role } from "@prisma/client"

// ------------------------ REGISTER ------------------------
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role || Role.STUDENT,
      },
    })

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)
    setCookies(res, accessToken, refreshToken)

    return res.status(201).json({
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
