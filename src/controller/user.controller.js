import { userModel } from "../models/index.js";
import crypto from "crypto";
import { createJWTToken } from "../util/auth.js";
import testUsersJson from "../assets/testUsers.js";

const generateToken = (res, user) => {
  const token = createJWTToken({
    _id: user._id,
    uuid: user.uuid,
    nickName: user.nickName,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    bio: user.bio,
    isPublic: user.isPublic,
    isHidden: user.isHidden,
    isOnline: user.isOnline,
  });

  res.cookie("tokenSerialized", token, {
    maxAge: 60 * 60 * 1000 * 24 * 5, // Duración de 5 dias
    httpOnly: true, // Protocolo http
    secure: false, // Conexión segura https
    sameSite: "lax",
  });
};

const authUsers = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    generateToken(res, user);
    return res.send({
      _id: user._id,
      uuid: user.uuid,
      nickName: user.nickName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      isPublic: user.isPublic,
      isHidden: user.isHidden,
      isOnline: user.isOnline,
    });
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
        message: "wrong user or password.",
      });
    }
    generateToken(res, user);
    return res.send({
      _id: user._id,
      uuid: user.uuid,
      nickName: user.nickName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      bio: user.bio,
      isPublic: user.isPublic,
      isHidden: user.isHidden,
      isOnline: user.isOnline,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const singupUser = async (req, res) => {
  try {
    req.body.uuid = crypto.randomUUID();
    const newUser = userModel(req.body);
    await newUser.save();
    generateToken(res, newUser);
    return res.send({
      _id: newUser._id,
      uuid: newUser.uuid,
      nickName: newUser.nickName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      bio: newUser.bio,
      isPublic: newUser.isPublic,
      isHidden: newUser.isHidden,
      isOnline: newUser.isOnline,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("tokenSerialized");
    return res.send("logged out");
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const testUsers = async (req, res) => {
  try {
    const selectedUsers = await userModel
      .find({ isTest: true })
      .select(["nickName", "avatar", "bio", "fisrtName", "lastName"]);

    if (selectedUsers.length <= 0) {
      createTestUsers(req, res);
    }
    res.send(selectedUsers);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const addFriend = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
      friends: { $ne: req.body.request },
      friendRequestSent: { $ne: req.body.request },
    });
    if (user === null) return res.send("null");
    const requested = await userModel.findOne({
      nickName: req.body.request,
    });
    if (requested.friends.includes(user.nickName)) {
      user.friends.unshift(requested.nickName);
      user.notifications.notifications.unshift({
        data: "You added " + requested.nickName + ", start chatting",
        timestamp: Date.now(),
      });
      user.notifications.unread++;
      await user.save();
      return res.send({ status: "friends", data: user.notifications });
    }

    if (requested.isPublic) {
      requested.friends.unshift(user.nickName);
      requested.notifications.notifications.unshift({
        data: user.nickName + " and you now are friends",
        timestamp: Date.now(),
      });
      requested.notifications.unread++;
      user.friends.unshift(requested.nickName);
      user.notifications.notifications.unshift({
        data: "You added " + requested.nickName + ", start chatting",
        timestamp: Date.now(),
      });
      user.notifications.unread++;
    } else {
      requested.friendRequestReceived.unshift(user.nickName);
      requested.notifications.notifications.unshift({
        data: user.nickName + " wants to be your friend",
        timestamp: Date.now(),
      });
      requested.notifications.unread++;

      user.friendRequestSent.unshift(requested.nickName);
      user.notifications.notifications.unshift({
        data: "Your request was sent to " + requested.nickName,
        timestamp: Date.now(),
      });
      user.notifications.unread++;
    }

    await requested.save();
    await user.save();
    //Aqui regresamos las notificaciones para no hacer doble consulta
    if (requested.isPublic)
      return res.send({ status: "friends", data: user.notifications });
    return res.send({ status: "request", data: user.notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const selectFriendsUsers = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    const selectedUsers = await userModel
      .find({ nickName: user.friends })
      .select([
        "nickName",
        "avatar",
        "bio",
        "isPublic",
        "firstName",
        "lastName",
        "isOnline",
        "images",
        "lastActiveAt",
        "-_id",
      ]);
    res.send(selectedUsers);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const selectRequestsUsers = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    const selectedUsers = await userModel
      .find({ nickName: user.friendRequestReceived })
      .select([
        "nickName",
        "avatar",
        "bio",
        "isPublic",
        "firstName",
        "lastName",
        "isOnline",
        "images",
        "lastActiveAt",
        "-_id",
      ]);
    res.send(selectedUsers);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const selectNotifications = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    return res.send(user.notifications);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const setNotifications = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    user.notifications = req.body;
    user.save();

    return res.send(user.notifications);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const setBio = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    user.bio = req.body.data;
    user.save();

    return res.send(user.bio);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const setAvatar = async (req, res) => {
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    user.avatar = req.body.data;
    user.save();

    return res.send(user.bio);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const blockUser = async (req, res) => {
  console.log(req.body.request);
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });

    const selectedUser = await userModel
      .findOne({
        nickName: req.body.request,
      })
      .select(["nickName"]);

    const index = user.friends.indexOf(selectedUser.nickName);
    user.friends.splice(index, 1);

    const index2 = user.friendRequestReceived.indexOf(selectedUser.nickName);
    user.friendRequestReceived.splice(index2, 1);

    const index3 = user.friendRequestSent.indexOf(selectedUser.nickName);
    user.friendRequestSent.splice(index3, 1);

    user.friendBlocked.unshift(selectedUser.nickName);

    user.save();

    return res.send(user.bio);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFriend = async (req, res) => {
  console.log(req.body.request);
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });

    const selectedUser = await userModel
      .findOne({
        nickName: req.body.request,
      })
      .select(["nickName"]);

    const index = user.friends.indexOf(selectedUser.nickName);
    user.friends.splice(index, 1);

    const index3 = user.friendRequestSent.indexOf(selectedUser.nickName);
    user.friendRequestSent.splice(index3, 1);

    user.save();

    return res.send(user.bio);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const selectRecommendedUsers = async (req, res) => {
  const { userparam } = req.params;
  try {
    const user = await userModel.findOne({
      nickName: req.verifiedUser.user.nickName,
    });
    let concatNin = user.friends.concat(
      user.friendRequestSent,
      user.friendBlocked
    );

    const selectedUsers = await userModel
      .find({
        isHidden: false,
        nickName: {
          $nin: concatNin,
          $ne: user.nickName,
        },
      })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select([
        "nickName",
        "avatar",
        "bio",
        "isPublic",
        "firstName",
        "lastName",
        "isOnline",
        "images",
        "lastActiveAt",
        "-_id",
      ]);
    res.send(selectedUsers);
  } catch (error) {
    console.log(error);
    res.clearCookie("tokenSerialized");
    return res.status(500).json({
      message: error.message,
    });
  }
};

const selectUsers = async (req, res) => {
  try {
    const selectedUsers = await userModel
      .find({ isPublic: true, isHidden: false })
      .select(["uuid", "nickName"]);

    res.send(selectedUsers);
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

  console.log(req.verifiedUser.user.nickName);
  //ese find con 2 condiciones para busqueda, tiene mas sentido para los chats, para estar seguro que el autor es elq ue esta modificando el campo, ojal
  await userModel.findOneAndUpdate(
    { _id: id, anothercampindata: req.verifiedUser.user.nickName },
    { datacamp, anoterdatacamp },
    { new: true }
  );

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

const createTestUsers = (req, res) => {
  try {
    testUsersJson.map(async (user) => {
      try {
        const uuid = crypto.randomUUID();
        const newUser = userModel({ ...user, uuid: uuid });
        await newUser.save();
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteall = async (req, res) => {
  await userModel.deleteMany();
  res.send("borrados");
};

export {
  authUsers,
  loginUser,
  singupUser,
  logoutUser,
  testUsers,
  addFriend,
  selectFriendsUsers,
  selectRecommendedUsers,
  selectRequestsUsers,
  selectNotifications,
  setNotifications,
  setBio,
  setAvatar,
  blockUser,
  deleteFriend,
  selectUsers,
  insertUser,
  updateUser,
  deleteall,
};
