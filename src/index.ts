import app from "./app";
import connectDB from "./config/db";

connectDB();
app.listen(4000, () => console.log("Server in port 4000"));
