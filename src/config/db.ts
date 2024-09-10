import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/devlink_db");
    console.log(">>> Connected to the database");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
