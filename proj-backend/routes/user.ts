import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient, Role, Status } from "@prisma/client";
import jwt from "jsonwebtoken";
import multer, { Multer } from "multer";
import path from "path";
import fs from "fs/promises";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/** ─────────────────────────────────────────────────────────────
 *  TS augmentation so req.authUser exists on Request
 *  (kept inside this file so ts-node definitely picks it up)
 *  ──────────────────────────────────────────────────────────── */
declare module "express-serve-static-core" {
  interface Request {
    authUser?: { id: number; role: Role; email: string; status: Status };
    file?: Express.Multer.File;
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
  }
}

// ──────────────────────────────────────────────────────────────
// Auth middleware
// ──────────────────────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing token" });
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number; role: Role; email: string; status: Status; iat: number; exp: number;
    };
    req.authUser = { id: decoded.id, role: decoded.role, email: decoded.email, status: decoded.status };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ──────────────────────────────────────────────────────────────
// Address helpers
// ──────────────────────────────────────────────────────────────
type AddressDTO = {
  line1?: string; line2?: string; city?: string; zip?: string; country?: string;
} | null;

function parseAddressFromUser(u: any): AddressDTO {
  // Prefer JSON column if present
  const j = (u as any)?.addressJson;
  if (j && typeof j === "object") {
    return {
      line1: j.line1 || "",
      line2: j.line2 || "",
      city: j.city || "",
      zip: j.zip || "",
      country: j.country || "",
    };
  }
  // Fallback: try legacy string as JSON
  if (u.address) {
    try {
      const parsed = JSON.parse(u.address);
      if (parsed && typeof parsed === "object") {
        return {
          line1: parsed.line1 || "",
          line2: parsed.line2 || "",
          city: parsed.city || "",
          zip: parsed.zip || "",
          country: parsed.country || "",
        };
      }
    } catch { /* ignore non-JSON legacy string */ }
  }
  return { line1: "", line2: "", city: "", zip: "", country: "" };
}

function serializeAddressForDB(a: AddressDTO): { addressJson: any | null; address: string | null } {
  if (!a) return { addressJson: null, address: null };
  const normalized = {
    line1: a.line1 || "",
    line2: a.line2 || "",
    city: a.city || "",
    zip: a.zip || "",
    country: a.country || "",
  };
  return {
    addressJson: normalized,
    address: JSON.stringify(normalized), // keep legacy string in sync
  };
}

function mapRoleForFE(role: Role): "ADMIN" | "CUSTOMER" | "SELLER" {
  return role === Role.SALES ? "SELLER" : (role as any);
}

// ──────────────────────────────────────────────────────────────
// GET /me  (no `select` → returns all scalar fields, including JSON)
// ──────────────────────────────────────────────────────────────
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const me = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
  if (!me) return res.status(404).json({ error: "User not found" });

  const address = parseAddressFromUser(me as any);
  const roleForFE = mapRoleForFE(me.role);

  const profile = {
    id: me.id,
    email: me.email,
    role: roleForFE,
    firstName: me.firstName || "",
    lastName: me.lastName || "",
    phone: me.phone || "",
    avatarUrl: me.profilePicUrl || "",
    address,
    storeName: me.storeName || "",
    businessType: me.businessType || "",
  };

  return res.json({ role: roleForFE, profile });
});

// ──────────────────────────────────────────────────────────────
// PUT /me
// ──────────────────────────────────────────────────────────────
router.put("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: AddressDTO;
      storeName?: string;
      businessType?: string;
    };

    const updates: any = {
      firstName: body.firstName ?? undefined,
      lastName: body.lastName ?? undefined,
      phone: body.phone ?? undefined,
      storeName: body.storeName ?? undefined,
      businessType: body.businessType ?? undefined,
    };

    if (body.address) {
      const { addressJson, address } = serializeAddressForDB(body.address);
      updates.addressJson = addressJson;
      updates.address = address;
    }

    await prisma.user.update({ where: { id: req.authUser!.id }, data: updates });

    // fetch full user (no select)
    const updated = await prisma.user.findUnique({ where: { id: req.authUser!.id } });

    const address = parseAddressFromUser(updated as any);
    const roleForFE = mapRoleForFE(updated!.role);
    const profile = {
      id: updated!.id,
      email: updated!.email,
      role: roleForFE,
      firstName: updated!.firstName || "",
      lastName: updated!.lastName || "",
      phone: updated!.phone || "",
      avatarUrl: updated!.profilePicUrl || "",
      address,
      storeName: updated!.storeName || "",
      businessType: updated!.businessType || "",
    };

    return res.json({ message: "Profile updated", profile });
  } catch (e) {
    console.error("PUT /me error:", e);
    return res.status(500).json({ error: "Update failed" });
  }
});

// ──────────────────────────────────────────────────────────────
// POST /avatar  (multipart/form-data)
// ──────────────────────────────────────────────────────────────
const AVATAR_DIR = path.join(process.cwd(), "uploads", "avatars");

const storage = multer.diskStorage({
  destination: async (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    try {
      await fs.mkdir(AVATAR_DIR, { recursive: true });
      cb(null, AVATAR_DIR);
    } catch (err: any) {
      cb(err, AVATAR_DIR);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const safe = `${req.authUser?.id || "u"}_${Date.now()}${ext}`;
    cb(null, safe);
  },
});
const upload: Multer = multer({ storage });

router.post("/avatar", requireAuth, upload.single("avatar"), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const relative = `/uploads/avatars/${file.filename}`;
    await prisma.user.update({ where: { id: req.authUser!.id }, data: { profilePicUrl: relative } });

    return res.json({ message: "Avatar uploaded", url: relative, avatarUrl: relative });
  } catch (e) {
    console.error("POST /avatar error:", e);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
