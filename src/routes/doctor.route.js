import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllDoctors,
  getCurrentDoctor,
  getDoctorById,
  updateDoctor,
  addHospital,
  removeHospital,
} from "../controllers/doctor.controller.js";

const router = Router();
router.use(verifyJWT);

// Doctors
router.get("/", getAllDoctors);         // Get all doctors
router.get("/me", getCurrentDoctor);   // Get current logged-in doctor
router.get("/:doctorId", getDoctorById); // Get doctor by ID
router.patch("/:doctorId", updateDoctor); // Update doctor

// Hospital association
router.post("/:doctorId/hospitals", addHospital);        // Add hospital
router.delete("/:doctorId/hospitals/:hospitalId", removeHospital); // Remove hospital

export default router;
