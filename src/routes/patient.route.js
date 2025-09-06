import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getAllPatients,
  getCurrentPatient,
  getPatientById,
  updatePatient,
  updateHospitals,
  addMedicalHistory,
  removeMedicalHistory,
} from "../controllers/patient.controller.js";

const router = Router();

// Apply auth middleware
router.use(verifyJWT);

// Patients
router.get("/", getAllPatients); // Get all patients
router.get("/me", getCurrentPatient); // Get logged-in patient (self)
router.get("/:patientId", getPatientById); // Get specific patient by ID
router.patch("/", updatePatient); // Update patient info
router.patch("/:hospitalId", updateHospitals); // Update patient's hospital

// Medical History
router.post("/:patientId/medical-history", addMedicalHistory); // Add history
router.delete("/:patientId/medical-history/:historyId", removeMedicalHistory); // Remove history

export default router;
