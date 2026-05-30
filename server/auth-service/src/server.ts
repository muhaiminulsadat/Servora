import app from "./app.ts";
import dotenv from "dotenv";
import connectDB from "./config/db.config.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
