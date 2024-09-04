import { connect } from "mongoose";

async function connectDB() {
  try {
    await connect("mongodb://127.0.0.1:27017/devlink_db");
    console.log(">>> Connected to the database");
  } catch (err) {
    console.log(err);
  }
}

export default connectDB;
