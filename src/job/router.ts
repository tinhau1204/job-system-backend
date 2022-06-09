import { Router } from "express";
import * as controller from "./controller";

const router = Router();

router.get("/job", controller.getAll);
router.get("/job/:employerId", controller.getJobByEmployer);
router.post("/job", controller.createJob);

export default router;
