import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.token;

        if(access_token !== undefined){
            next();
        }else{
            req.flash("error", "Token is not given")
        }
    } catch (error: any) {
        req.flash("error", error.message);
        res.redirect("/login");
    }
}