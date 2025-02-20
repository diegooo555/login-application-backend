import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { getUsers } from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.post("/register", register);

userRouter.post("/login");

userRouter.post("/logout");

userRouter.get("/", getUsers);


export default userRouter;