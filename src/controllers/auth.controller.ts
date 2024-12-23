import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class AuthController {
    static async getLoginPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("auth/login");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async login(req: Request, res: Response, next: NextFunction){
        try {
            const { username, password } = req.body;

            const checkAdmin = await client.admin.findUnique({
                where: {
                    username
                }
            })

            const checkEmployee = await client.employee.findUnique({
                where: {
                    username
                }
            })

            if(checkAdmin){
                if(checkAdmin.password === password){
                    const token = await sign({ id: checkAdmin.id, role: checkAdmin.role }, process.env.SECRET_KEY as string, { expiresIn: "10h"});

                    res.cookie("token", token);
                    req.flash("success", "Welcome back admin");
                    res.redirect("/admins")
                }else{
                    req.flash("error", "Wrong password");
                    res.redirect("/login");
                }
            }else if(checkEmployee){
                if(checkEmployee.password === password){
                    const token = sign({ id: checkEmployee.id, role: checkEmployee.role }, process.env.SECRET_KEY as string, { expiresIn: "10h" });

                    res.cookie("token", token);
                    req.flash("success", "Welcome back employee");
                    res.redirect("/employees")
                }else{
                    req.flash("error", "Wrong password");
                    res.redirect("/login");
                }
            }else{
                req.flash("error", "Wrong username");
                res.redirect("/login")
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }
}