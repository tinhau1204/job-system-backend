import { NextFunction, Request, Response } from "express";
import { HttpException } from "./types";

export const notFound = (req: Request, res: Response) => {
    res.status(404);
    res.json({
        error: "Not found",
        path: req.url,
    });
};

export const errorHandler = (
    error: HttpException,
    _: Request,
    res: Response,
    _1: NextFunction,
) => {
    return res.status(error.status).json({ message: error.message });
};

export const logErrors = (
    err: HttpException,
    _: Request,
    _1: Response,
    next: NextFunction,
) => {
    console.log("Server error #" + new Date().toString());
    console.error(err.stack);

    next(err);
};
