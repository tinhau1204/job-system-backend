import cors, { CorsOptions } from "cors";
import CORSWhitelist from "./cors";
import express, { Request, Response, Handler } from "express";
import { errorHandler, logErrors, notFound } from "@/middleware/errors";
import userRouter from "@/user/router";
import jobRouter from "@/job/router";
import morgan from "morgan";

const app = express();

morgan.format(
    "logger_format",
    '[:date[clf]] ":method :url" :status :res[content-length] - :response-time ms',
);

app.use(cors(CORSWhitelist as CorsOptions));
app.use(express.json());
app.use(morgan("logger_format") as Handler);
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/", (_: Request, res: Response) =>
    res.status(400).send("Hello cai dmm luon"),
);
app.use(logErrors);
app.use(errorHandler);
app.use(notFound);

export default app;
