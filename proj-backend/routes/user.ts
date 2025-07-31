import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// GET /user/me
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        customerId: true,
        sellerId: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        profilePicUrl: true,
        storeName: true,
        businessType: true,
        storeLogoUrl: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

// PUT /user/me
router.put("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      profilePicUrl,
      storeName,
      businessType,
      storeLogoUrl,
    } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        address,
        profilePicUrl,
        storeName,
        businessType,
        storeLogoUrl,
      },
    });

    res.json({ message: "Profile updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
