import { userModel } from "../models/index.js";
import crypto from "crypto";
import { createJWTToken } from "../util/auth.js";

const selectUsers = async (req, res) => {
  try {
    const selectedUsers = await userModel
      .find({ isPublic: true, isHided: false })
      .select(["uuid", "nickName"]);

    res.send(selectedUsers);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    //res.send(req.headers.authorization);

    const user = await userModel
      .findOne({ nickName: req.body.nickName })
      .select("+password");

    if (!user || req.body.password !== user.password) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const token = createJWTToken({
      _id: user._id,
      uuid: user.uuid,
      nickName: user.nickName,
    });

    return res.send(token);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const insertUser = async (req, res) => {
  try {
    req.body.uuid = crypto.randomUUID();

    const newUser = userModel(req.body);
    const token = createJWTToken(newUser);
    const isNewUserSaved = await newUser.save();

    res.send(newUser);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { dato1, dato2, dato3 } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE historico SET dato1 = IFNULL(?, dato1), dato2 = IFNULL(?, dato2), dato3 = IFNULL(?, dato3) WHERE id = ?",
      [dato1, dato2, dato3, id]
    );

    if (result.affectedRows <= 0)
      return res
        .status(404)
        .json({ message: "No hay datos para ese codigo up" });

    const [rows] = await pool.query("SELECT * FROM historico WHERE id = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { selectUsers, loginUser, insertUser, updateUser };
