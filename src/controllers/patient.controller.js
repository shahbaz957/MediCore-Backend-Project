import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/Patient.models.js";
import { User } from "../models/User.models.js";

const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate("user_id", "name email picture")
    .populate("admittedIn", "name city")
    .populate({
      path: "medicalHistory.treatedBy",
      select: "user_id qualification experienceInYears",
      populate: {
        path: "user_id",
        select: "name email",
      },
    });
  if (!patients) {
    throw new ApiError(404, "Patients are not fetched Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, patients, "All patients are Fetched Successfully")
    );
});

const getCurrentPatient = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(401, "No User is fetched");
  }
  const patient = await Patient.findOne({ user_id: user._id })
    .populate("user_id", "name email picture")
    .populate("admittedIn", "name city")
    .populate({
      path: "medicalHistory.treatedBy",
      select: "user_id qualification experienceInYears",
      populate: {
        path: "user_id",
        select: "name email",
      },
    });

  if (!patient) {
    throw new ApiError(
      404,
      "Patient Not Found Or UnAuthorized Access Invalid ID"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient is Fetched Successfully"));
});

const getPatientById = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  if (!patientId) {
    throw new ApiError(400, "Provide Patient ID please");
  }
  const patient = await Patient.findById(patientId)
    .populate("user_id", "name email picture")
    .populate("admittedIn", "name city")
    .populate({
      path: "medicalHistory.treatedBy",
      select: "user_id qualification experienceInYears",
      populate: {
        path: "user_id",
        select: "name email",
      },
    });
  if (!patient) {
    throw new ApiError(404, "Patient Not Found Check Your ID");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient is Fetched Successfully"));
});

const updatePatient = asyncHandler(async (req, res) => {
  const { diagonsedWith, address, age, bloodGroup } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }

  const patient = await Patient.findOne({ user_id: user._id });
  if (!patient) {
    throw new ApiError(404, "Patient Not Found Check Your ID");
  }

  patient.diagonsedWith = diagonsedWith || patient.diagonsedWith;
  patient.address = address || patient.address;
  patient.age = age || patient.age;
  patient.bloodGroup = bloodGroup || patient.bloodGroup;

  await patient.save();

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient is Updated Successfully"));
});

const updateHospitals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const { hospitalId } = req.params;
  if (!hospitalId) {
    throw new ApiError(401, "Hospital Id is Not Present in Request body");
  }

  const updatedPatient = await Patient.findOneAndUpdate(
    { user_id: user._id },
    {
      $set: {
        admittedIn: hospitalId,
      },
    },
    { new: true }
  );
  if (!updatedPatient) {
    throw new ApiError(401, "Hospital Is Not Updated Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPatient, "Hospital is updated Succesfully")
    );
});

// For Updating the Medical History of the Patient

const addMedicalHistory = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { condition, treatedBy, notes, medications } = req.body;
  // Checks
  if (!patientId) {
    throw new ApiError(401, "Please Provide Patient ID");
  }
  if (!condition || !treatedBy || !notes || !medications) {
    throw new ApiError(400, "Provide all the fields in medical History");
  }
  if (!Array.isArray(medications)) {
    medications = [medications];
  }
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    {
      $push: {
        medicalHistory: { condition, treatedBy, notes, medications },
      },
    },
    {
      new: true,
    }
  );
  if (!patient) {
    throw new ApiError(401, "Medical History is Not Updated Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, patient, "Medical History is added Succesfully")
    );
});

const removeMedicalHistory = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  if (!patientId) {
    throw new ApiError(401, "Patient iD is not present");
  }
  const { historyId } = req.body;
  if (!historyId) {
    throw new ApiError(401, "Please Provide the History Id for Removal");
  }
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    {
      $pull: {
        medicalHistory: { _id: historyId },
      },
    },
    {
      new: true,
    }
  );
  if (!patient) {
    throw new ApiError(401, "MedicalHistory is Not removed Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, patient, "Medical History is updated Successfully")
    );
});
export {
  getAllPatients,
  getCurrentPatient,
  getPatientById,
  updatePatient,
  updateHospitals,
  addMedicalHistory,
  removeMedicalHistory,
};
