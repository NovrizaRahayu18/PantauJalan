import { Router } from "express";
import { uploadProgressImages, verifyImageFiles } from "../middlewares/upload.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  listProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progress.controller.js";

const router = Router();
const staff = authorize("admin", "petugas");

router.get("/reports/:reportId/progress", listProgress);
router.get("/progress/:id", getProgressById);

router.post("/reports/:reportId/progress", authenticate, staff, uploadProgressImages, verifyImageFiles, createProgress);
router.put("/progress/:id", authenticate, staff, uploadProgressImages, verifyImageFiles, updateProgress);
router.delete("/progress/:id", authenticate, staff, deleteProgress);

export default router;
