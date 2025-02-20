import prisma from "../modules/prisma.js"
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const {email, name, password, role, status} = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: req.body.email }
        });
        
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: passwordHashed,
                role,
                status
            }
        });

        res.json(newUser);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while creating user"});
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while fetching users"});
    }
}