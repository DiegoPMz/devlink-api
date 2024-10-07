import { connect } from "mongoose";
import { DB_URI } from "./db-config";

const connectDB = async () => {
  try {
    await connect(DB_URI);
    console.log(">>> Connected to the database");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
