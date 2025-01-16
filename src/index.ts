import app from "./app";
import { BACKEND_PORT } from "./config";
import connectDB from "./config/db";

connectDB();
app.listen(BACKEND_PORT, () => console.log(`Server in port ${BACKEND_PORT}`));
