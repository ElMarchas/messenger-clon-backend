import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    nickName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    avatar: { type: String, default: "" },
    password: { type: String, select: false, default: "" },
    email: {
      type: String,
      //match: [/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, "No valid email"],
    },
    bio: { type: String, default: "" },
    chats: Array,
    friends: Array,
    friendRequestSent: Array,
    friendRequestReceived: Array,
    friendBlocked: Array,
    notifications: {
      notifications: Array,
      unread: { type: Number, default: 0 },
    },
    images: [
      {
        url: String,
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        createdAt: Date,
      },
    ],
    isPublic: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
    isTest: { type: Boolean, default: false },
    isOnline: { type: String, default: "online" },
    lastActiveAt: Date,
  },
  { timestamps: true }
);

export default model("user", userSchema);
