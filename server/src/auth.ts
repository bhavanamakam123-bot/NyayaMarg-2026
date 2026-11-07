import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { db, ROOT } from "./db.js";

const secretFile = path.join(ROOT, "data", "session.secret");

function sessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (fs.existsSync(secretFile)) return fs.readFileSync(secretFile, "utf8");
  const created = crypto.randomBytes(32).toString("hex");
  fs.mkdirSync(path.dirname(secretFile), { recursive: true });
  fs.writeFileSync(secretFile, created, { mode: 0o600 });
  return created;
}

export const SECRET = sessionSecret();

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 12);
}

export function checkPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function signToken(userId: number) {
  return jwt.sign({ uid: userId }, SECRET, { expiresIn: "7d" });
}

export function setSession(res: Response, userId: number) {
  res.cookie("nm_session", signToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearSession(res: Response) {
  res.clearCookie("nm_session", { path: "/" });
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.nm_session;
  if (!token) return res.status(401).json({ error: "Please sign in to continue." });
  try {
    const payload = jwt.verify(token, SECRET) as { uid: number };
    const user = db.prepare("SELECT id FROM users WHERE id = ?").get(payload.uid);
    if (!user) return res.status(401).json({ error: "Please sign in to continue." });
    req.userId = payload.uid;
    next();
  } catch {
    return res.status(401).json({ error: "Your session has ended. Please sign in again." });
  }
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
