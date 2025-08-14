import { Router, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient, Role, Status } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// ─────────────────────────────────────────────
// Auth helpers (uses your types/express.d.ts augmentation)
// ─────────────────────────────────────────────
function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = String(req.headers.authorization || "");
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ error: "Missing token" });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number; role: Role; email: string; status: Status;
    };

    req.authUser = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      status: decoded.status,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.authUser?.role !== Role.ADMIN) {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

// ─────────────────────────────────────────────
// GET /api/admin/overview
// ─────────────────────────────────────────────
router.get("/overview", requireAuth, requireAdmin, async (_req, res) => {
  const [usersCount, sellersPending, ordersCount, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: Role.SALES, status: Status.PENDING } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ]);

  res.json({
    usersCount,
    sellersPending,
    ordersCount,
    revenueTotal: Number(revenueAgg._sum.totalAmount || 0),
  });
});

// ─────────────────────────────────────────────
// GET /api/admin/users   ?page=1&pageSize=20&q=term
// ─────────────────────────────────────────────
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.pageSize || "20"), 10)));
  const q = String(req.query.q || "").trim();

  let where: Prisma.UserWhereInput = {};
  if (q) {
    const I = Prisma.QueryMode.insensitive;
    where = {
      OR: [
        { email: { contains: q, mode: I } },
        { firstName: { contains: q, mode: I } },
        { lastName: { contains: q, mode: I } },
        { customerId: { contains: q, mode: I } },
        { sellerId: { contains: q, mode: I } },
      ],
    };
  }

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        firstName: true,
        lastName: true,
        customerId: true,
        sellerId: true,
        createdAt: true,
      },
    }),
  ]);

  res.json({ total, rows, page, pageSize });
});

// ─────────────────────────────────────────────
// PATCH /api/admin/users/:id  { role?, status? }
// ─────────────────────────────────────────────
router.patch("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { role, status } = req.body as { role?: Role; status?: Status };

  const data: Prisma.UserUpdateInput = {};
  if (role) data.role = role;
  if (status) data.status = status;

  await prisma.user.update({ where: { id }, data });
  res.json({ message: "User updated" });
});

// ─────────────────────────────────────────────
// GET /api/admin/sellers?status=PENDING|ACTIVE|SUSPENDED
// ─────────────────────────────────────────────
router.get("/sellers", requireAuth, requireAdmin, async (req, res) => {
  const raw = String(req.query.status || "PENDING").toUpperCase();
  const status: Status = (Object.values(Status) as string[]).includes(raw) ? (raw as Status) : Status.PENDING;

  const rows = await prisma.user.findMany({
    where: { role: Role.SALES, status },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      status: true,
      storeName: true,
      businessType: true,
      sellerId: true,
      createdAt: true,
    },
  });

  res.json({ rows });
});

// ─────────────────────────────────────────────
// PATCH /api/admin/sellers/:id/approve  { action: 'approve'|'reject' }
// ─────────────────────────────────────────────
router.patch("/sellers/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const action = String(req.body.action || "approve");
  const status = action === "approve" ? Status.ACTIVE : Status.SUSPENDED;

  await prisma.user.update({ where: { id }, data: { status } });
  res.json({ message: `Seller ${action}d` });
});

export default router;
