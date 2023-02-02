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
      trim: true,
    },
    firstName: String,
    lastName: String,
    password: String,
    email: String,
    chats: Array,
    isPublic: { type: Boolean, default: true },
    isHided: { type: Boolean, default: false },
    isTest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("user", userSchema);
