import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/Doctor.models.js";
import { User } from "../models/User.models.js";
const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find()
    .populate("worksInHospitals", "name city specializedIn")
    .populate("user_id", "name email picture");
  if (!doctors || doctors.length === 0 ) {
    throw new ApiError(404, "Doctors Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, doctors, "All Doctors are Fetched"));
});

const getCurrentDoctor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const doctor = await Doctor.findOne({ user_id: user._id }).populate(
    "worksInHospitals",
    "name city"
  );
  if (!doctor) {
    throw new ApiError(
      404,
      "Requested Doctor Access is not Valid Try with Valid Id"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor is Fetched Successfully"));
});

const getDoctorById = asyncHandler(async (req, res) => {
  // this is the generic Route
  const { doctorId } = req.params;
  if (!doctorId) {
    throw new ApiError(401, "Please Provide the DoctorID");
  }
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, "Doctor Not Found. Check Your Id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor is Fetched Successfully"));
});

// This is the secured Route cuz only logged in user Can be able to change means logged in Doctor
const updateDoctor = asyncHandler(async (req, res) => {
  // Manipulate Here Only Doctor Specified Fields
  const { salary, qualification, experienceInYears } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  const doctor = await Doctor.findOne({ user_id: user._id });
  if (salary) {
    doctor.salary = salary;
  }
  if (qualification) {
    doctor.qualification = qualification;
  }
  if (experienceInYears) {
    doctor.experienceInYears = experienceInYears;
  }
  await doctor.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor is Updated Successfully"));
});

// ALso secure to doctor only because it is about manipulating the info of doctor
const addHospital = asyncHandler(async (req, res) => {
  const {doctorId} = req.params;
  if (!doctorId) {
    throw new ApiError(400, "Please provide the Doctor's Id");
  }
  let { hospitalIds } = req.body;
  if (hospitalIds.length === 0) {
    throw new ApiError(403 , "Please Provide Hospital Ids")
  }
  if (!Array.isArray(hospitalIds)){
    hospitalIds = [hospitalIds]
  }
  const updatedDoctor = await Doctor.findByIdAndUpdate(
    doctorId,
    {
      $addToSet: {
        worksInHospitals: { $each: hospitalIds },
      },
    },
    { new: true }
  );
  if (!updatedDoctor) {
    throw new ApiError(401, "Hospital is not Added");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedDoctor, "Hospital is added Successfully"));
});

const removeHospital = asyncHandler(async (req, res) => {
  const { doctorId, hospitalId } = req.params;

  const doctor = await Doctor.findByIdAndUpdate(
    doctorId,
    { $pull: { worksInHospitals: hospitalId } },
    { new: true }
  ).populate("worksInHospitals", "name city");

  if (!doctor) throw new ApiError(404, "Doctor not found");

  return res.status(200).json(new ApiResponse(200, doctor, "Hospital removed"));
});

export { getAllDoctors, getCurrentDoctor, getDoctorById, updateDoctor , addHospital , removeHospital };
