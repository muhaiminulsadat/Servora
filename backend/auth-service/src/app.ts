import express from "express";
import router from "./routes/auth.route.ts";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", router);

app.use(errorHandler);

export default app;
