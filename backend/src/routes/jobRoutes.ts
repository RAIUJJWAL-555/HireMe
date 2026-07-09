import { Router } from "express";
import { auth, adminOnly } from "../middleware";
import { validate } from "../middleware/validate";
import { createJobSchema, updateJobSchema } from "../validations/jobSchema";
import { listJobs, getJob, createJob, updateJob, deleteJob } from "../controllers/jobController";

const router = Router();

router.use(auth);

router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", validate(createJobSchema), createJob);
router.put("/:id", validate(updateJobSchema), updateJob);
router.delete("/:id", adminOnly, deleteJob);

export default router;
