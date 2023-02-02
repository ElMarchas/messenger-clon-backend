import { Router } from "express";

const router = Router();

router.get("/api", (req, res) => {
  res.send("main api");
});

export default router;
