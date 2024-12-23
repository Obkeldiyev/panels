import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const verifyEmployeeRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.token;

        if(access_token !== undefined){
            const token: any = verify(access_token, process.env.SECRET_KEY as string);

            if(token.role === "employee"){
                next();
            }else{
                req.flash("error", "No status");
                res.redirect("/login")
            }
        }else{
            req.flash("error", "Token is not given")
        }
    } catch (error: any) {
        req.flash("error", error.message);
        res.redirect("/");
    }
}