import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user"; // ✅ Add this line
import adminRoutes from "./routes/admin"; // ✅ Add admin routes
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/admin", adminRoutes); // ✅ Mount admin routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // ✅ Mount user routes

app.get("/", (_req: Request, res: Response) => {
  res.send("✅ API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
