import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class employeeController {
    static async getProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const employee = await client.employee.findUnique({
                where: {
                    id: data.id
                }
            });

            if(employee){
                res.render("employees/gotProfile", { employee });
            }else{
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getEmployeeCreatePage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("employees/create");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async createEmployee(req: Request, res: Response, next: NextFunction){
        try {
            const { first_name, second_name, third_name, username, password } = req.body;

            const checkAdmin = await client.admin.findUnique({
                where: {
                    username
                }
            });

            const checkUsername2 = await client.employee.findUnique({
                where: {
                    username
                }
            })

            if(checkAdmin && checkUsername2){
                req.flash("error", "This username has been taken");
                res.redirect("/employees");
            }else{
                await client.employee.create({
                    data: {
                        username,
                        first_name,
                        second_name,
                        third_name,
                        password
                    }
                });

                req.flash("success", "The employee created successfully");
                res.redirect("/employees");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getEmployeeUpdateProfilePage(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const employee = await client.employee.findUnique({
                where: {
                    id: data.id
                }
            });

            if(employee){
                req.flash("success", "Your profile update");
                res.render("employees/update", { employee });
            }else{
                req.flash("error", "Please login");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async updateEmployeeProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { first_name, second_name, third_name, username, password } = req.body;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.employee.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                const checkUsername = await client.admin.findUnique({
                    where: {
                        username
                    }
                })

                const checkUsername2 = await client.employee.findUnique({
                    where: {
                        username
                    }
                });

                if(checkUsername && checkUsername2){
                    req.flash("error", "This username has been taken try another one");
                    res.redirect("/employees/profile/update");
                }else{
                    await client.admin.update({
                        data: {
                            first_name,
                            second_name,
                            third_name,
                            username,
                            password
                        },
                        where: {
                            id: data.id
                        }
                    });

                    req.flash("success", "Your profile updated successfully");
                    res.redirect("/employees");
                }
            }else{
                req.flash("error", "THis employee does not exists");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async deleteEmployeeProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkEmployee = await client.employee.findUnique({
                where: {
                    id: data.id
                }
            });

            if(checkEmployee){
                await client.employee.delete({
                    where: {
                        id: data.id
                    }
                })
            }else{
                req.flash("error", "This employee does not exists");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getEmployeeMainPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("employees/main")
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async exit(req: Request, res: Response, next: NextFunction){
        try {
            res.clearCookie;
            res.redirect("/login")
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }
}