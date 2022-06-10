import PrismaDB from "../database";
import { Prisma, Job, Employer } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const getAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const jobs: Job[] = await PrismaDB.instance.job.findMany();

        return res.status(200).send({ message: jobs });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};

export const getJobByEmployer = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id }: Pick<Employer, "id"> = req.query as any;

        const jobs: Job[] = await PrismaDB.instance.job.findMany({
            where: {
                id: BigInt(id),
            },
        });

        return res.status(200).send({ message: jobs });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};

export const createJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {
            name,
            salary,
            place,
            field,
            employmentStatus,
            experienceNeeded,
            description,
            employerId
        } = req.body;

        const job: Pick<Job, "id"> = await PrismaDB.instance.job.create({
            data: {
                name,
                salary,
                place,
                field,
                employmentStatus,
                experienceNeeded,
                description,
                employerId,
            },
            select: {
                id: true
            }
        });

        return res.status(200).send({ message: job.id.toString() });
    } catch (error: any) {
        next(error);
        console.log(error.message);
        return res.status(400).send({
            message: error.message,
        });

    }
};
