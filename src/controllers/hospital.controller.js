import { Department } from "../models/Departments.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/Doctor.models.js";
import { User } from "../models/User.models.js";
import mongoose from "mongoose";
import { Hospital } from "../models/Hospital.models.js";

const createHospital = asyncHandler(async (req, res) => {
  let { name, city, address, pincode, specializedIn } = req.body;

  if (!name || !city || !address || !pincode ) {
    throw new ApiError(
      400,
      "Please Provide all the Fields For Creation of Hospital"
    );
  }
  if (!Array.isArray(specializedIn)) {
    specializedIn = [specializedIn];
  }
  const hospital = await Hospital.create({
    name: name,
    pincode: pincode,
    city: city,
    address: address,
    specializedIn: specializedIn || [],
  });
  if (!hospital) {
    throw new ApiError(401, "Hospital is Not Created Successfully");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Hospital is Created Successfully"));
});

const updateHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  if (!hospitalId) {
    throw new ApiError(300, "Hospital Id is not Provided");
  }
  const { name, city, address, pincode } = req.body;
  if (!name && !city && !address && !pincode) {
    throw new ApiError(401, "Please provide At Least One field to Update");
  }
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) {
    throw new ApiError(404, "Hospital is Not Found");
  }
  if (name) {
    hospital.name = name;
  }
  if (city) {
    hospital.city = city;
  }
  if (address) {
    hospital.address = address;
  }
  if (pincode) {
    hospital.pincode = pincode;
  }
  await hospital.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Hospital is Updated Successfully"));
});

// Add And Remove Departments

const addDepartment = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  if (hospitalId) {
    throw new ApiError(401, "Hospital Id is Not Provided");
  }
  let depts = req.body;
  // depts should be an array
  if (!Array.isArray(depts)) {
    depts = [depts];
  }
  const updatedHospital = await Hospital.findByIdAndUpdate(
    hospitalId,
    {
      $addToSet: {
        specializedIn: {
          $each: depts,
        },
      },
    },
    { new: true }
  );
  if (!updateHospital) {
    throw new ApiError(401, "Departments are Not Added Successfully");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedHospital,
        "Departments are Added Successfully"
      )
    );
});

const removeDepartment = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  if (!hospitalId) {
    throw new ApiError(401, "Hospital Id is Not Provided");
  }
  const depts = req.body;
  if (!Array.isArray(depts)) {
    depts = [depts];
  }
  const updatedHospital = await Hospital.findByIdAndUpdate(
    hospitalId,
    {
      $pull: {
        specializedIn: { $in: depts },
      },
    },
    { new: true }
  );
  if (!updatedHospital) {
    throw new ApiError(401, "Departments are Not Removed Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedHospital,
        "Departments are Removed Successfully"
      )
    );
});

const getHospitalDetails = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;
  if (!hospitalId) {
    throw new ApiError(400, "Hospital Id is not Provided");
  }
  const hospitalDetails = await Hospital.findById(hospitalId).populate(
    "specializedIn",
    "name description head"
  );
  if (!hospitalDetails) {
    throw new ApiError(401, "Hospital Details are Not Fetched");
  }

  const doctorStat = await Department.aggregate([
    {
      $match: {
        hospital: new mongoose.Types.ObjectId(hospitalId),
      },
    },
    {
      $project: {
        numsDoctor: {
          $size: "$doctors",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalDoctors: {
          $sum: "$numsDoctor",
        },
      },
    },
  ]);
  const totalDoctors = doctorStat.length > 0 ? doctorStat[0].totalDoctors : 0;

  const patientStat = await Department.aggregate([
    {
      $match: {
        hospital: new mongoose.Types.ObjectId(hospitalId),
      },
    },
    {
      $project: {
        numsPatient: {
          $size: "$patients",
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPatients: {
          $sum: "$numsPatient",
        },
      },
    },
  ]);
  const totalPatients =
    patientStat.length > 0 ? patientStat[0].totalPatients : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Details: hospitalDetails,
        TotalDoctors: totalDoctors,
        TotalPatients: totalPatients,
      },
      "Details of Hospital are Fetched"
    )
  );
});

export {
    createHospital,
    updateHospital,
    addDepartment,
    removeDepartment,
    getHospitalDetails
}
