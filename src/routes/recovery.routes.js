import { Router } from "express";
import { forgotPassword, resetPassword } from "../controllers/recovery.controller.js";

const recoveryRouter = Router();

recoveryRouter.post("/forgot-password", forgotPassword);

recoveryRouter.post("/reset-password", resetPassword);

export default recoveryRouter;

