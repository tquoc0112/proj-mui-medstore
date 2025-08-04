// proj-backend/middleware/adminOnly.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
