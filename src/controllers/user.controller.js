import prisma from "../modules/prisma.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {email, name, password, user_role} = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: req.body.email }
        });
        
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const passwordHashed = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: passwordHashed,
            }
        });

        const newRole = await prisma.userRole.create({
            data: {
                id_user: newUser.id_user,
                user_role: user_role
            }
        });

        const auth_token = jwt.sign({id_user: newUser.id, role: newRole.user_role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(201).json({
            auth_token,
            role: newRole.user_role
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while creating user"});
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {email},
            select: {id_user: true, password: true, name: true}
        });

        const role = await prisma.userRole.findFirst({
            where: {id_user: user.id_user}
        });

        if (!user || !role) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const auth_token = jwt.sign({id_user: user.id_user, role: role.user_role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({
            auth_token,
            role: role.user_role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while logging in"});
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

export const getUserRoles = async (req, res) => {
    try {
        const userRoles = await prisma.userRole.findMany();
        res.json(userRoles);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error while fetching user roles"});
    }
}

export const getDataTeacher = async (req, res) => {
    const user = req.user;
    const validation = await validateUserAndRole(user.id_user, "TEACHER");

    if (!validation) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    
    res.status(200).json({message: `Bienvenid@ al panel de profesor ${validation.name}`});
}

export const getDataStudent = async (req, res) => {
    const user = req.user;
    const validation = await validateUserAndRole(user.id_user, "STUDENT");

    if (!validation) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    
    res.status(200).json({message: `Bienvenid@ al panel de estudiantes ${validation.name}`});
}

export const getDataAdmin = async (req, res) => {
    const user = req.user;
    const validation = await validateUserAndRole(user.id_user, "ADMIN");

    if (!validation) {
        return res.status(400).json({message: "Invalid credentials"});
    }
    
    res.status(200).json({message: `Bienvenid@ al panel de administrador ${validation.name}`});
}

const validateUserAndRole = async (id, role) => {
    try {
        const validateUser = await prisma.user.findUnique({
            where: {id_user: id}
        });
    
        const validateRole = await prisma.userRole.findFirst({
            where: {id_user: id, user_role: role}
        });
        
        if (!validateUser || !validateRole) {
            return false;
        }else{
            return validateUser;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}