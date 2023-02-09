import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  try {
    const db = await mongoose.connect("mongodb://127.0.0.1/messengerClon");
    console.log("DB connected to", db.connection.name);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
