import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// JSON error handler (prevents HTML pages)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

app.listen(5000, () => console.log("API running at http://localhost:5000"));
