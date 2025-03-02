import prisma from "../modules/prisma.js";

export const validateAdmin = async (req, res, next) => {
    const user = req.user;    
    if (user.role !== "ADMIN") {
        return res.status(401).json({message: "Unauthorized"});
    }else{
        const findUser = await prisma.user.findUnique({
            where: {id_user: user.id_user}
        });
        if (!findUser) {
            return res.status(401).json({message: "Unauthorized"});
        }
    }
    next();
}