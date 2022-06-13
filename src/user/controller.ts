import PrismaDB from "../database";
import { Employer, Prisma, Role, Student, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { email, firstName, lastName, password, role, phoneNumber }: User =
        req.body;
    console.log(email, firstName);
    try {
        const user: Pick<User, "id"> = await PrismaDB.instance.user.create({
            data: {
                email,
                firstName,
                lastName,
                password,
                role: role === "Student" ? Role.Student : Role.Employer,
                phoneNumber,
            },
        });

        switch (role) {
            case Role.Student:
                await PrismaDB.instance.student.create({
                    data: {
                        userId: user.id,
                    },
                });

                break;
            case Role.Employer:
                await PrismaDB.instance.employer.create({
                    data: {
                        userId: user.id,
                    },
                });
                break;
        }

        return res.status(201).send({ message: user.id.toString() });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(400).send({
                    message: "This email has been used.",
                });
            }
        }
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { email, password } = req.body;

    try {
        const user: User | null = await PrismaDB.instance.user.findFirst({
            where: {
                email,
                password,
            },
        });

        if (user === null) {
            return res.status(400).send({
                message: "Invalid email address or password.",
            });
        }

        res.status(200).send({
            message: { ...user, id: user.id.toString() },
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2011") {
                return res.status(400).send({
                    message: "Invalid email address or password",
                });
            }
        }
    }
};

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
