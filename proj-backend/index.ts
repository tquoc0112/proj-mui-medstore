import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Dùng router cho auth
app.use("/api/auth", authRoutes);

// ✅ Route test
app.get("/", (_req: Request, res: Response) => {
  res.send("✅ API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
