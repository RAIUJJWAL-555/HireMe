import { Router } from "express";
import multer from "multer";
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
import { importCandidates } from "../controllers/candidateImportController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "text/csv" ||
      file.originalname.endsWith(".csv")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

const router = Router();

router.use(auth);

router.get("/", listCandidates);
router.get("/:id", getCandidate);
router.post("/", validate(createCandidateSchema), createCandidate);
router.post("/import", upload.single("file"), importCandidates);
router.put("/:id", validate(updateCandidateSchema), updateCandidate);
router.delete("/:id", adminOnly, deleteCandidate);
router.patch("/:id/stage", validate(stageTransitionSchema), updateStage);

export default router;
