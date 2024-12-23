import { AdminController } from "@controllers";
import { Router } from "express";
import { verifyAdminRole } from "src/middlewares/verifyAdmin";
import { verifyToken } from "src/middlewares/verifyToken";

const adminRouter: Router = Router();

adminRouter.get("/employee/:employeeId", verifyToken, verifyAdminRole, AdminController.getEmployeeDetails);
adminRouter.get("/admins/create", verifyToken, verifyAdminRole, AdminController.getAdminCreatePage);
adminRouter.get("/admins/profile", verifyToken, verifyAdminRole, AdminController.getProfile);
adminRouter.get("/admins", verifyToken, verifyAdminRole, AdminController.getAdminMainPage);
adminRouter.get("/admins/profile/update", verifyToken, verifyAdminRole, AdminController.getAdminUpdateProfilePage);
adminRouter.get("/admins/employees", verifyToken, verifyAdminRole, AdminController.getAllEmployees);
adminRouter.post("/admins/create", verifyToken, verifyAdminRole, AdminController.createAdmin);
adminRouter.post("/admins/profile/update", verifyToken, verifyAdminRole, AdminController.updateAdminProfile);
adminRouter.post("/admins/profile/delete", verifyToken, verifyAdminRole, AdminController.deleteAdminProfile);
adminRouter.post("/admins/exit", verifyToken, verifyAdminRole, AdminController.exit);

export default adminRouter;