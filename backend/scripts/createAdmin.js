const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const ROLES = require("../constants/roles");

async function main() {
    try{
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        const existing = await prisma.user.findUnique({
            where: {email: process.env.ADMIN_EMAIL},
        });

        if(existing){
            console.log("Admin already exists");
            return;
        }

        await prisma.user.create({
            data: {
                name: "Admin",
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: ROLES.ADMIN,
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