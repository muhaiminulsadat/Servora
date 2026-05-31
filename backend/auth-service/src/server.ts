import app from "./app.ts";
import dotenv from "dotenv";
import connectDB from "./config/db.config.ts";
import {connectRedis} from "./config/redis.config.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

await connectDB();

await connectRedis();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
