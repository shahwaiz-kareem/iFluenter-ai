import express from "express";
import {
  getConfigs,
  updateConfig,
} from "../controllers/systemConfig.controller.js";
const router = express.Router();

// Private routes
router.get("/", getConfigs);
router.put("/update", updateConfig);

export default router;
