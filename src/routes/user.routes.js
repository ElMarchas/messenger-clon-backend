import { Router } from "express";
import {
  authUsers,
  loginUser,
  singupUser,
  logoutUser,
  testUsers,
  addFriend,
  selectRecommendedUsers,
  selectFriendsUsers,
  selectRequestsUsers,
  selectNotifications,
  setNotifications,
  blockUser,
  deleteFriend,
  setBio,
  setAvatar,
  selectUsers,
  insertUser,
  updateUser,
  deleteall,
} from "../controller/user.controller.js";
import isAuth from "../middlewares/auth.js";

const router = Router();
/*
router.get("/", selectLastHistorico);
router.get("/:codigo_p", selectOneHistorico);
router.delete("/:id", deleteOneHistorico);
*/
router.get("/borrar", deleteall);
router.post("/login", loginUser);
router.post("/singup", singupUser);
router.get("/logout", logoutUser);
router.get("/test", testUsers);
router.get("/", isAuth, selectUsers);
router.post("/add", isAuth, addFriend);
router.get("/recommended/:user", isAuth, selectRecommendedUsers);
router.get("/friends/:user", isAuth, selectFriendsUsers);
router.get("/requests/:user", isAuth, selectRequestsUsers);
router.get("/notifications/:user", isAuth, selectNotifications);
router.post("/notifications/", isAuth, setNotifications);
router.post("/bio/", isAuth, setBio);
router.post("/avatar/", isAuth, setAvatar);
router.post("/block/", isAuth, blockUser);
router.post("/deletefriend/", isAuth, deleteFriend);

router.get("/auth", isAuth, authUsers);

router.post("/", isAuth, insertUser);

router.patch("/:id", isAuth, updateUser);

export default router;
