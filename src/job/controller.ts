import PrismaDB from "@/database";
import { Employer, Job, JobAppliedStatus, Student } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const getAllJob = async (
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const jobs: Job[] = await PrismaDB.instance.job.findMany();

        return res.status(200).send({
            message: jobs.map((job, _) => ({
                ...job,
                id: job.id.toString(),
                employerId: job.employerId!.toString(),
            })),
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};

export const getAllJobByEmployer = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params as any;

        const employer: Pick<Employer, "id"> | null =
            await PrismaDB.instance.employer.findFirst({
                where: {
                    userId: BigInt(id),
                },
            });

        const jobs: Job[] = await PrismaDB.instance.job.findMany({
            where: {
                employerId: employer!.id,
            },
        });

        return res.status(200).send({
            message: jobs.map((job, _) => ({
                ...job,
                id: job.id.toString(),
                employerId: job.employerId!.toString(),
            })),
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};

export const getAllJobByStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params as any;

    if (id !== "undefined") {
        const student: Pick<Student, "id"> | null =
            await PrismaDB.instance.student.findFirst({
                where: {
                    userId: BigInt(id),
                },
                select: {
                    id: true,
                },
            });

        try {
            let jobs = await PrismaDB.instance.jobAppliedStatus.findMany({
                where: {
                    studentId: student!.id,
                },
                include: {
                    job: {
                        select: {
                            name: true,
                            imageUrl: true,
                        },
                    },
                },
            });

            return res.status(200).send({
                message: jobs.map((jobApplied, _) => ({
                    imageUrl: jobApplied.job!.imageUrl,
                    status: jobApplied.status,
                    name: jobApplied.job!.name,
                    appliedAt: jobApplied.appliedAt,
                })),
            });
        } catch (error: any) {
            next(error);
            console.log(error.message);

            return res.status(400).send({
                message: error.message,
            });
        }
    }
};

export const getAllStudentByJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params as any;

    try {
        let students = await PrismaDB.instance.jobAppliedStatus.findMany({
            where: {
                jobId: BigInt(id),
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).send({
            message: students.map((jobApplied, _) => ({
                id: jobApplied.id.toString(),
                ...jobApplied.student?.user,
                status: jobApplied.status,
            })),
        });
    } catch (error: any) {
        next(error);
        console.log(error.message);

        return res.status(400).send({
            message: error.message,
        });
    }
};

export const applyJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { jobId, studentId } = req.body;

    const student: Pick<Student, "id"> | null =
        await PrismaDB.instance.student.findFirst({
            where: {
                userId: BigInt(studentId),
            },
            select: {
                id: true,
            },
        });

    try {
        let job = await PrismaDB.instance.jobAppliedStatus.create({
            data: {
                studentId: student!.id,
                jobId: BigInt(jobId),
            },
            select: {
                id: true,
            },
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
            imageUrl,
            description,
            employerId,
        } = req.body;

        const employer: Pick<Employer, "id"> | null =
            await PrismaDB.instance.employer.findFirst({
                where: {
                    userId: BigInt(employerId),
                },
            });

        const job: Pick<Job, "id"> = await PrismaDB.instance.job.create({
            data: {
                name,
                salary,
                place,
                field,
                employmentStatus,
                experienceNeeded,
                description,
                imageUrl,
                employerId: employer!.id,
            },
            select: {
                id: true,
            },
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

export const changeStudentAppliedStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { jobAppliedId, status } = req.body;

    try {
        let job = await PrismaDB.instance.jobAppliedStatus.update({
            where: {
                id: BigInt(jobAppliedId),
            },
            data: {
                status,
            },
            select: {
                id: true,
            },
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
