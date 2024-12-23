import { AuthController } from "@controllers";
import { Router } from "express";

const authRoutes: Router = Router();

authRoutes.get("/login", AuthController.getLoginPage);
authRoutes.post("/login", AuthController.login);

export default authRoutes;