import { Router } from "express";
import adminRouter from "./admin";
import employeeRoutes from "./employee";
import authRoutes from "./auth";
import trackRoutes from "./track";
import { Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.redirect("/login")
})
router.use(adminRouter);
router.use(employeeRoutes);
router.use(authRoutes);
router.use(trackRoutes);

router.use((req: Request, res: Response) => {
    res.render("not-found")
});

export default router;