import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/student/:id", controller.getStudentInfo);
router.get("/employer/:id", controller.getEmployerInfo);
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

export default router;
