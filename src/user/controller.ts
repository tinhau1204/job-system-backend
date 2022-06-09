import PrismaDB from "../database";
import { Prisma, Role, User } from "@prisma/client";
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
        const user: Pick<User, "id" | "role"> | null =
            await PrismaDB.instance.user.findFirst({
                where: {
                    email,
                    password,
                },
                select: {
                    id: true,
                    role: true,
                },
            });

        if (user === null) {
            return res.status(400).send({
                message: "Invalid email address or password.",
            });
        }

        res.status(200).send({
            message: { id: user.id.toString(), role: user.role },
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
