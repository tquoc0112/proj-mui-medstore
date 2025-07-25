import express, { Request, Response, NextFunction } from "express";
import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ================== REGISTER ==================
app.post("/register", async (req: Request, res: Response) => {
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role && role === "SALES" ? Role.SALES : Role.CUSTOMER;
    const userStatus =
      userRole === Role.SALES ? Status.PENDING : Status.ACTIVE;

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userRole,
        status: userStatus,
        firstName,
        lastName,
        phone,
        address,

        // Sales-specific fields (optional for customers)
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
      newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== LOGIN ==================
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // If Sales account is not approved
    if (user.role === Role.SALES && user.status !== Status.ACTIVE) {
      return res
        .status(403)
        .json({ error: "Your account is pending admin approval." });
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
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ================== MIDDLEWARE: AUTH ==================
const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ================== PROTECTED ROUTE ==================
app.get(
  "/me",
  authMiddleware,
  async (req: Request & { user?: any }, res: Response) => {
    res.json({ message: "Authenticated user", user: req.user });
  }
);

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
