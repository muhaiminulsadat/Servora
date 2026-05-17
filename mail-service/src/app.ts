import express from "express";
import mailRouter from "./routes/mail.route.ts";

const app: express.Application = express();

app.use(express.json());

app.use("/api/v1/", mailRouter);

export default app;
