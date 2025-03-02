import { Router } from "express";
import { register, login, getUsers, getUserRoles, getDataTeacher, getDataAdmin, getDataStudent } from "../controllers/user.controller.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateAdmin } from "../middlewares/validateAdmin.js";
import { verifyCaptcha } from "../middlewares/verifyCaptcha.js";

const userRouter = Router();

userRouter.post("/register", validateToken, validateAdmin, register,);

userRouter.post("/login", verifyCaptcha, login);

userRouter.post("/logout");

userRouter.get("/",  getUsers);

userRouter.get("/roles", getUserRoles);

userRouter.get("/student", validateToken, getDataStudent);

userRouter.get("/teacher", validateToken, getDataTeacher);

userRouter.get("/admin", validateToken,  getDataAdmin);

export default userRouter;