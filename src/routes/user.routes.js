import { Router } from "express";
import {
  selectUsers,
  loginUser,
  insertUser,
  updateUser,
} from "../controller/user.controller.js";

const router = Router();
/*
router.get("/", selectLastHistorico);
router.get("/:codigo_p", selectOneHistorico);
router.delete("/:id", deleteOneHistorico);
*/
router.get("/", selectUsers);
router.get("/login", loginUser);
router.post("/", insertUser);

router.patch("/:id", updateUser);

export default router;
