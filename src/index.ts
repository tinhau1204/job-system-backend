import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            firstName: "Do",
            lastName: "Vien",
            email: "vienpro2506@gmail.com",
            password: "anhvien1",
            phoneNumber: "0705390759",
            role: "Student",
        }
    })
    const allUsers = await prisma.user.findMany();
    console.log(allUsers)
}

main()
    .catch(e => { throw e })
    .finally(async () => {
        await prisma.$disconnect()
    })
