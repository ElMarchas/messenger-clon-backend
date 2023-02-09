import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("hola mundo 2");
});

export default router;
