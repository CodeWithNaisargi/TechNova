import jwt from "jsonwebtoken";
import { Response } from "express";

interface TokenPayload {
  id: string;
  role: string;
}

// FIX: Define your own safe type instead of importing SignOptions
interface JWTSafeOptions {
  expiresIn?: string | number;
}

const isProduction = process.env.NODE_ENV === "production";

export const generateTokens = (id: string, role: string) => {
  const payload: TokenPayload = { id, role };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    } as JWTSafeOptions
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    } as JWTSafeOptions
  );

  return { accessToken, refreshToken };
};

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const clearCookies = (res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 0,
    path: "/",
  });

  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 0,
    path: "/",
  });
};
