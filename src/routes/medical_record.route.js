import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createMedicalRecord,
  getAllPatientRecord,
  getAllRecords,
  getDoctorRecords,
  updateRecord,
} from "../controllers/medical_record.controller.js";

const router = Router();

// Apply JWT verification to all routes
router.use(verifyJWT);

// ✅ RESTful routes
router.post("/", createMedicalRecord); // Create new record
router.get("/", getAllRecords); // Get all records (maybe admin/doctor only)
router.get("/:patientId", getAllPatientRecord); // Get records for one patient
router.get("/doctor/me", getDoctorRecords); // Get all records for logged-in doctor
router.patch("/:recordId", updateRecord); // Update specific record

export default router;
