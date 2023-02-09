import { Schema, model } from "mongoose";

const chatSchema = new Schema(
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
    firstName: String,
    lastName: String,
    avatar: String,
    password: { type: String, select: false },
    email: {
      type: String,
      //unique: true,
      //match: [/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, "No valid email"],
    },
    chats: Array,
    isPublic: { type: Boolean, default: true },
    isHided: { type: Boolean, default: false },
    isTest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("chat", chatSchema);
