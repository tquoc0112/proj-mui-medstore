// proj-backend/routes/admin.ts

import express from "express";
import { PrismaClient, Status } from "@prisma/client";
import { adminOnly } from "../middleware/adminOnly";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /admin/users
 */
router.get("/users", adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
 * PUT /admin/users/:id/approve
 * Use ACTIVE to represent approval
 */
router.put("/users/:id/approve", adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: Status.ACTIVE },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

/**
 * PUT /admin/users/:id/reject
 * Use SUSPENDED to represent rejection
 */
router.put("/users/:id/reject", adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status: Status.SUSPENDED },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ error: "Failed to reject user" });
  }
});

export default router;
