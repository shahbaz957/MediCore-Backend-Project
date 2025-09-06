import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createDept,
  updateDept,
  addDoctors,
  addPatients,
  getDepartmentDetails,
} from "../controllers/departments.controller.js";

const router = Router();

router.use(verifyJWT);

// Departments
router.post("/", createDept); // Create new department
router.get("/:deptId", getDepartmentDetails); // Get department details
router.patch("/:deptId", updateDept); // Update department

// Doctors in Department
router.patch("/:deptId/doctors", addDoctors); // Add doctors (array supported)

// Patients in Department
router.patch("/:deptId/patients", addPatients); // Add patients (array supported)

export default router;
