import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/Patient.models.js";
import { User } from "../models/User.models.js";
import { MedicalRecord } from "../models/medical_record.models.js";
import { Doctor } from "../models/Doctor.models.js";

// Secured Route Means you have the access of req.user
const createMedicalRecord = asyncHandler(async (req, res) => {
  let { patient, doctor, hospital, disease, medications } = req.body;
  // Remember only Doctor can Create A medical Record
  if (req.user.role !== "Doctor") {
    throw new ApiError(401, "Only Doctor can Create Medical Record");
  }
  if (!Array.isArray(medications)) {
    medications = [medications];
  }
  const record = await MedicalRecord.create({
    patient: patient,
    doctor: doctor,
    hospital: hospital,
    disease: disease,
    medications: medications || [],
  });

  if (!record) {
    throw new ApiError(401, "Record is Not Created");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, record, "Record is Created Successfully"));
});

const getAllRecords = asyncHandler(async (req, res) => {
  if (req.user?.role !== "Doctor") {
    throw new ApiError("Only Doctor can see All records");
  }
  const record = await MedicalRecord.find()
    .populate(
      {
        path: "doctor.user_id",
        select: "name email",
      },
      {
        path: "doctor",
        select: "qualification",
      }
    )
    .populate(
      {
        path: "patient.user_id",
        select: "name email",
      },
      {
        path: "patient",
        select: "diagonsedWith age bloodGroup gender medicalHistory",
      },
      {
        path: "patient.admittedIn",
        select: "name city",
      }
    )
    .populate("hospital", "name city");
  if (!record) {
    throw new ApiError(401, "Records are Not Fetched");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, record, "All Records are Fetched Successfully"));
});

const getAllPatientRecord = asyncHandler(async (req, res) => {
  // A particular User Can Have Multiple Projects
  const { patientId } = req.params;
  if (!patientId) {
    throw new ApiError(401, "Please Provide a patient Id");
  }
  if (req.user?.role === "Patient" && req.user?._id !== patientId) {
    throw new ApiError(
      "Only Doctor and Respective Patient can Fetch its Record"
    );
  }
  const record = await MedicalRecord.findOne({ patient: patientId })
    .populate(
      {
        path: "doctor.user_id",
        select: "name email",
      },
      {
        path: "doctor",
        select: "qualification",
      }
    )
    .populate(
      {
        path: "patient.user_id",
        select: "name email",
      },
      {
        path: "patient",
        select: "diagonsedWith age bloodGroup gender medicalHistory",
      },
      {
        path: "patient.admittedIn",
        select: "name city",
      }
    )
    .populate("hospital", "name city");
  if (!record) {
    throw new ApiError(401, "Record is Not Fetched");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, record, "Record Is Fetched Successfully"));
});

const getDoctorRecords = asyncHandler(async (req, res) => {
  // Here You have to fetch all medical Records where doctor == doctorId
  if (req.user?.role === "Patient") {
    throw new ApiError(403, "Only Doctor Have Access to This");
  }

  // Fetched ALl the Records of the Doctor
  const records = await MedicalRecord.findOne({ doctor: req.user._id })
    .populate(
      {
        path: "doctor.user_id",
        select: "name email",
      },
      {
        path: "doctor",
        select: "qualification",
      }
    )
    .populate(
      {
        path: "patient.user_id",
        select: "name email",
      },
      {
        path: "patient",
        select: "diagonsedWith age bloodGroup gender medicalHistory",
      },
      {
        path: "patient.admittedIn",
        select: "name city",
      }
    )
    .populate("hospital", "name city");
  if (!records) {
    throw new ApiError(401, "Records Are not Fetched");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        records,
        "Records respective to Particular User are Fetched"
      )
    );
});

const updateRecord = asyncHandler(async (req, res) => {
  // patch request
  const { recordId } = req.params;
  const { disease, medications } = req.body;
  if (!medications && !disease) {
    throw new ApiError(403, "Provide Atleast One Field to Update");
  }
  const record = await MedicalRecord.findById(recordId);
  if (req.user._id !== record.doctor) {
    throw new ApiError("Only Doctor Who Created The Record Can Change It");
  }
  if (!Array.isArray(medications)) {
    medications = [medications];
  }
  const updatedRecord = await MedicalRecord.findOneAndUpdate(
    { _id: recordId, doctor: req.user._id },
    {
      $set: {
        disease: disease,
        medications: medications,
      },
    },
    { new: true }
  );
  if (!updatedRecord) {
    throw new ApiError(401, "Record is not Updated Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedRecord, "Records are Updated Successfully")
    );
});

export {
  createMedicalRecord,
  getAllPatientRecord,
  getAllRecords,
  getDoctorRecords,
  updateRecord,
};
