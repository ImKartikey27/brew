import jwt from "jsonwebtoken"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXP;
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXP;

if(!ACCESS_SECRET){
    throw new Error("JWT_ACCESS_SECRET is not defined");
}
if(!REFRESH_SECRET){
    throw new Error("JWT_REFRESH_SECRET is not defined");
}

// Type assertions after validation - TypeScript now knows these are strings
const accessSecret: string = ACCESS_SECRET;
const refreshSecret: string = REFRESH_SECRET;

export interface TokenPayload {
  sub: string; // user ID
  email: string;
}

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, accessSecret, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string, email: string): string {
  return jwt.sign({ sub: userId, email }, refreshSecret, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, refreshSecret) as TokenPayload;
}

