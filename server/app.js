import express from "express";
import cors from "cors";
import heroRoutes from "./modules/superheroes/hero.routes.js";
import uploadRoutes from "./modules/uploads/upload.routes.js";
import { errorMiddleware } from "./middleware/error.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/superheroes", heroRoutes);
app.use("/", uploadRoutes);

app.use(errorMiddleware);
export default app;
