import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import prisma from "../config/prisma"
import { Role } from "@prisma/client"

interface DecodedToken {
  id: string
  role: Role
  iat: number
  exp: number
}

/**
 * Extend Express Request type so req.user is valid
 */
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string
      role: Role
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined

  // 1) Try access token from cookies (primary)
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken
  }

  // 2) Fallback to Authorization header (Bearer xxx)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  // 3) No token found
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" })
  }

  try {
    // 4) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken

    // 5) Check if user exists
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" })
    }

    // 6) Blocked user check
    if (user.isBlocked) {
      return res
        .status(403)
        .json({ success: false, message: "User account is blocked" })
    }

    // 7) Attach user to req for access in controllers
    req.user = { id: decoded.id, role: decoded.role }

    return next()
  } catch (err) {
    console.error("Auth error:", err)
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" })
  }
}
