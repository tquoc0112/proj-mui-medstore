import { Router, Request, Response } from "express";
import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Utility: map any inbound role string to our Prisma Role enum.
// Accepts "SELLER" from FE but stores as "SALES" in DB for backward-compat.
function normalizeRole(input?: string): Role {
  const r = (input || "").trim().toUpperCase();
  if (r === "ADMIN") return Role.ADMIN;
  if (r === "SALES" || r === "SELLER") return Role.SALES;
  return Role.CUSTOMER;
}

// ================== REGISTER ==================
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      address,
      storeName,
      businessType,
      pharmacyLicense,
      licenseDocUrl,
      taxId,
      storeLogoUrl,
      businessAddress,
      ownerIdProofUrl,
      proofOfAddressUrl,
      medicalCertUrl,
      bankName,
      accountHolder,
      accountNumber,
    } = req.body;

    const trimmedEmail = String(email || "").trim();
    if (!trimmedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = normalizeRole(role);
    const userStatus = userRole === Role.SALES ? Status.PENDING : Status.ACTIVE;

    // Generate CUSxxx / SELxxx codes
    const generateCustomId = async (prefix: string, modelField: "customerId" | "sellerId") => {
      const count = await prisma.user.count({ where: { [modelField]: { not: null } } as any });
      const nextNumber = count + 1;
      return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
    };

    let customerId: string | null = null;
    let sellerId: string | null = null;
    if (userRole === Role.CUSTOMER) customerId = await generateCustomId("CUS", "customerId");
    if (userRole === Role.SALES) sellerId = await generateCustomId("SEL", "sellerId");

    await prisma.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        role: userRole,
        status: userStatus,
        customerId,
        sellerId,
        firstName,
        lastName,
        phone,
        address, // legacy single-line (kept)
        storeName,
        businessType,
        pharmacyLicense,
        licenseDocUrl,
        taxId,
        storeLogoUrl,
        businessAddress,
        ownerIdProofUrl,
        proofOfAddressUrl,
        medicalCertUrl,
        bankName,
        accountHolder,
        accountNumber,
      },
    });

    res.status(201).json({
      message:
        userRole === Role.SALES
          ? "Seller registered successfully. Pending admin approval."
          : "User registered successfully",
    });
  } catch (error) {
    console.error("REGISTER error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const trimmedEmail = String(req.body.email || "").trim();
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    // Block sellers (SALES) until approved
    if (user.role === Role.SALES && user.status !== Status.ACTIVE) {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }

    const isPasswordValid = await bcrypt.compare(String(password || ""), user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, status: user.status },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("LOGIN error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== CHANGE PASSWORD ==================
router.post("/change-password", async (req: Request, res: Response) => {
  try {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing token" });

    // Verify JWT (not just decode) before allowing sensitive action
    // jsonwebtoken docs: verify() checks signature & expiration. :contentReference[oaicite:1]{index=1}
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number; email: string; role: Role; status: Status; iat: number; exp: number;
    };

    const { email, password, newPassword } = req.body as {
      email?: string; password?: string; newPassword?: string;
    };

    if (!password || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Optional: if client sends email, ensure it matches the token's user
    if (email && String(email).trim() !== user.email) {
      return res.status(403).json({ error: "Email does not match authenticated user" });
    }

    const ok = await bcrypt.compare(String(password), user.password); // bcrypt compare current pw :contentReference[oaicite:2]{index=2}
    if (!ok) return res.status(400).json({ error: "Current password is incorrect" });

    const hashed = await bcrypt.hash(String(newPassword), 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    res.json({ message: "Password changed" });
  } catch (error: any) {
    console.error("CHANGE-PASSWORD error:", error);
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
