import { connect } from "mongoose";
import { DB_URL } from "./db-config";

const connectDB = async () => {
  try {
    await connect(DB_URL);
    console.log(">>> Connected to the database");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
