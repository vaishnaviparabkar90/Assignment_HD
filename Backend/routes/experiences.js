// routes/experiences.js
import express from "express";
import { getExperiences, getExperienceById } from "../controllers/experienceController.js";

const router = express.Router();

router.get("/", getExperiences);
router.get("/:id", getExperienceById);

export default router;
