import { Router, Request, Response } from "express";
import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

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

    const trimmedEmail = email.trim(); // ✅ trim email

    // Kiểm tra email trùng
    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "SALES" ? Role.SALES : Role.CUSTOMER;
    const userStatus = userRole === Role.SALES ? Status.PENDING : Status.ACTIVE;

    const generateCustomId = async (prefix: string, modelField: "customerId" | "sellerId") => {
      const count = await prisma.user.count({
        where: { [modelField]: { not: null } },
      });
      const nextNumber = count + 1;
      return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
    };

    let customerId: string | null = null;
    let sellerId: string | null = null;

    if (userRole === Role.CUSTOMER) {
      customerId = await generateCustomId("CUS", "customerId");
    } else if (userRole === Role.SALES) {
      sellerId = await generateCustomId("SEL", "sellerId");
    }

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
      },
    });

    res.status(201).json({
      message:
        userRole === Role.SALES
          ? "Seller registered successfully. Pending admin approval."
          : "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req: Request, res: Response) => {
  try {
    const trimmedEmail = req.body.email.trim(); // ✅ trim email
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    if (user.role === "SALES" && user.status !== Status.ACTIVE) {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        status: user.status,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
