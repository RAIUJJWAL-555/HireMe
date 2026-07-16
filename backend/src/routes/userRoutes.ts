import { Router } from "express";
import { auth, adminOnly } from "../middleware";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../validations/userSchema";
import { listUsers, createUser, deleteUser } from "../controllers/userController";

const router = Router();

router.use(auth);

router.get("/", adminOnly, listUsers);
router.post("/", adminOnly, validate(createUserSchema), createUser);
router.delete("/:id", adminOnly, deleteUser);

export default router;
