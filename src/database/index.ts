import { PrismaClient } from "@prisma/client";

class PrismaDB extends PrismaClient {
    private static _instance: PrismaDB = new PrismaClient({
        errorFormat: "pretty",
    });

    private constructor() {
        super();
    }

    public static get instance() {
        return PrismaDB._instance;
    }
}

export default PrismaDB;
