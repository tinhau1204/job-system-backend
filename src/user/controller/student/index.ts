import { Student } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import PrismaDB from "@/database";

export const getStudentInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params as any;

    try {
        const student: Student | null =
            await PrismaDB.instance.student.findFirst({
                where: {
                    id: BigInt(id),
                },
            });

        res.status(200).send({
            message: student,
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};
