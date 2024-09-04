import app from "./app";
import connectDB from "./db";

connectDB();
app.listen(400, () => console.log("Server in port 4000"));
