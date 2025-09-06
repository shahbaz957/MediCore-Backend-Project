import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createHospital,
  updateHospital,
  addDepartment,
  removeDepartment,
  getHospitalDetails,
} from "../controllers/hospital.controller.js";

const router = Router();

router.use(verifyJWT);

// Hospitals
router.post("/", createHospital); // Create hospital
router.get("/:hospitalId", getHospitalDetails); // Get hospital details
router.patch("/:hospitalId", updateHospital); // Update hospital

// Departments inside a hospital
router.post("/:hospitalId/departments", addDepartment); // Add department
router.delete("/:hospitalId/departments", removeDepartment); // Remove department

export default router;
