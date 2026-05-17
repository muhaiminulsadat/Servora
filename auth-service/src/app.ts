import express from "express";
import router from "./routes/auth.route.ts";

const app = express();

app.use(express.json());

app.use("/", router);

export default app;
