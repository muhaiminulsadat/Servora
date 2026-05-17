import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", proxy("http://localhost:3001"));

app.listen(PORT, () => {
  console.log(`Gateway server is running on port ${PORT}`);
});
