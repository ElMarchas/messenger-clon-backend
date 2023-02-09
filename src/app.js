import express from "express";
import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import morgan from "morgan";
import authenticate from "./middlewares/auth.js";

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use(authenticate);

app.use(indexRoutes);
app.use("/api/user", userRoutes);

export default app;
