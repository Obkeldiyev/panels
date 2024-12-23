import express, { Application } from "express";
import dotenv from "dotenv"
import router from "./routes";
import { ErrorHandlerMiddleware } from "@middlewares";
import * as path from "path";
import session from "express-session";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();

const app: Application = express();


app.use(cookieParser());

app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
}))
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));
app.use(express.static(path.join(process.cwd(), "src", "public")));
app.use(express.urlencoded({extended: true}));

app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

let PORT = process.env.APP_PORT || 9000
app.listen(PORT, () => {console.log(PORT)})