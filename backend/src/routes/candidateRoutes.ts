import { Router } from "express";
import { auth, adminOnly } from "../middleware";
import { validate } from "../middleware/validate";
import {
  createCandidateSchema,
  updateCandidateSchema,
  stageTransitionSchema,
} from "../validations/candidateSchema";
import {
  listCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  updateStage,
} from "../controllers/candidateController";

const router = Router();

router.use(auth);

router.get("/", listCandidates);
router.get("/:id", getCandidate);
router.post("/", validate(createCandidateSchema), createCandidate);
router.put("/:id", validate(updateCandidateSchema), updateCandidate);
router.delete("/:id", adminOnly, deleteCandidate);
router.patch("/:id/stage", validate(stageTransitionSchema), updateStage);

export default router;
