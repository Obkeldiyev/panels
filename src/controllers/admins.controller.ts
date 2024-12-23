import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path"
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class AdminController {
    static async getProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                res.render("admins/gotProfile", { admin });
            }else{
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAdminCreatePage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("admins/create");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async createAdmin(req: Request, res: Response, next: NextFunction){
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
                res.redirect("/admins");
            }else{
                await client.admin.create({
                    data: {
                        username,
                        first_name,
                        second_name,
                        third_name,
                        password
                    }
                });

                req.flash("success", "The admin created successfully");
                res.redirect("/admins");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getAdminUpdateProfilePage(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                req.flash("success", "Your profile update", { admin });
                res.render("admins/update");
            }else{
                req.flash("error", "Please login");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async updateAdminProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { first_name, second_name, third_name, username, password } = req.body;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
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
                })

                if(checkUsername && checkUsername2){
                    req.flash("error", "This username has been taken try another one");
                    res.redirect("/admins/profile/update");
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
                    res.redirect("/admins");
                }
            }else{
                req.flash("error", "THis admin does not exists");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async deleteAdminProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkAdmin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(checkAdmin){
                await client.admin.delete({
                    where: {
                        id: data.id
                    }
                })
            }else{
                req.flash("error", "This admin does not exists");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getAdminMainPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("admins/main")
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getAllEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await client.employee.findMany();
            res.render("admins/dashboard", { employees });
        } catch (error) {
            next(error);
        }
    }

    static async getEmployeeDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = req.params;

            const employee = await client.employee.findUnique({
                where: { id: parseInt(employeeId) },
                include: {
                    trackings: {
                        include: {
                            photos: true,
                        },
                    },
                },
            });

            if (!employee) {
                return res.status(404).json({ message: "Employee not found" });
            }

            // Add tracking duration in seconds to each tracking
            employee.trackings.forEach((tracking) => {
                if (tracking.startedAt && tracking.stopTime) {
                    const start = new Date(tracking.startedAt).getTime();
                    const stop = new Date(tracking.stopTime).getTime();
                    tracking.duration = Math.floor((stop - start) / 1000); // Duration in seconds
                } else {
                    tracking.duration = 0; // If stop time is missing, set to 0
                }

                // Update photo URLs to be accessible from /screenshots
                tracking.photos.forEach((photo) => {
                    photo.url = `/screenshots/${path.basename(photo.url)}`;
                });
            });

            res.render("admins/employeeDetails", { employee });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
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
