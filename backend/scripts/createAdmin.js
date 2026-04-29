const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

async function main() {
    try{
        const hashedPassword = await bcrypt.hash("admin@123", 10);

        const existing = await prisma.user.findUnique({
            where: {email: "admin@gmail.com"},
        });

        if(existing){
            console.log("Admin already exists");
            return;
        }

        await prisma.user.create({
            data: {
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        console.log("Admin created successfully");
    } catch(err) {
        console.log(err);
    } finally{
        prisma.$disconnect();
    }
}

main();