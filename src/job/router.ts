import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/", controller.getAllJob);
router.get("/employer/:id", controller.getAllJobByEmployer);
router.get("/student/:id", controller.getAllJobByStudent);
router.get("/:id", controller.getAllStudentByJob);
router.post("/", controller.createJob);
router.post("/apply", controller.applyJob);
router.put("/apply", controller.changeStudentAppliedStatus);

export default router;
