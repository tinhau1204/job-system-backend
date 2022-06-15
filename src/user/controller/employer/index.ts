import { Employer } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import PrismaDB from "@/database";

export const getEmployerInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params as any;

    try {
        const employer: Employer | null =
            await PrismaDB.instance.employer.findFirst({
                where: {
                    id: BigInt(id),
                },
            });

        res.status(200).send({
            message: employer,
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};
