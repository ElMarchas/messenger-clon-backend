import express from "express";
import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
//import authenticate from "./middlewares/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: ["http://localhost:5173", "*"], credentials: true }));

//app.use(authenticate);
//test cookies, retirar
app.get("/galleta", (req, res) => {
  res.cookie("galletota", "galletita", {
    maxAge: 60 * 60 * 1000 * 24 * 5, // Duración de 5 dias
    httpOnly: true, // Protocolo http
    secure: false,
    sameSite: "lax",
  });
  console.log("Cookies :  ", req.cookies);
  res.send("holamundo");
});

app.use(indexRoutes);
app.use("/api/user", userRoutes);

export default app;
