import express, { Application } from "express";
import dotenv from "dotenv"
import router from "./routes";
import { ErrorHandlerMiddleware } from "@middlewares";
dotenv.config();

const app: Application = express();
app.use(express.json());

app.use(router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware)

let PORT = process.env.APP_PORT || 9000
app.listen(PORT, () => {console.log(PORT)})