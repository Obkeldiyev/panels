import express from "express";
import { employeeController } from "../controllers/employee.controller";
import { verifyEmployeeRole } from "src/middlewares/verifyEmployee";
import { verifyToken } from "src/middlewares/verifyToken";
import { verifyAdminRole } from "src/middlewares/verifyAdmin";

const employeeRoutes = express.Router();

employeeRoutes.get("/employees/profile", verifyToken, verifyEmployeeRole, employeeController.getProfile);
employeeRoutes.get("/employees/create", verifyToken, verifyAdminRole, employeeController.getEmployeeCreatePage);
employeeRoutes.post("/employees/create", verifyToken, verifyAdminRole, employeeController.createEmployee);
employeeRoutes.get("/employees/profile/update", verifyToken, verifyEmployeeRole, employeeController.getEmployeeUpdateProfilePage);
employeeRoutes.post("/employees/profile/update", verifyToken, verifyEmployeeRole, employeeController.updateEmployeeProfile);
employeeRoutes.post("/employees/profile/delete", verifyToken, verifyEmployeeRole, employeeController.deleteEmployeeProfile);
employeeRoutes.get("/employees", verifyToken, employeeController.getEmployeeMainPage);
employeeRoutes.post("/employees/exit", verifyToken, verifyEmployeeRole, employeeController.exit);

export default employeeRoutes;
