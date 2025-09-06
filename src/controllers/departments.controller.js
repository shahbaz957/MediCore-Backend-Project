import { Department } from "../models/Departments.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/Doctor.models.js";
import { User } from "../models/User.models.js";
import mongoose from "mongoose";

const createDept = asyncHandler(async (req, res) => {
  const { name, description, head, hospital } = req.body;
  if (!name || !description || !head) {
    throw new ApiError(400, "Please Provide all the Fields");
  }
  const dept = await Department.create({
    name: name,
    description: description,
    head: head,
    hospital: hospital || null,
  });
  if (!dept) {
    throw new ApiError(401, "Department is Not Created Successfully");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, dept, "Department is created Successfully"));
});

const updateDept = asyncHandler(async (req, res) => {
  const {deptId} = req.params;
  if (!deptId) {
    throw new ApiError(400, "Department Id is not provided");
  }
  const { name, description, hospital, head } = req.body;
  if (!name && !description && !hospital && !head) {
    throw new ApiError(401, "Please Provide At least One field for Updation");
  }
  const dept = await Department.findById(deptId);
  if (name) {
    dept.name = name;
  }
  if (description) {
    dept.description = description;
  }
  if (hospital) {
    dept.hospital = hospital;
  }
  if (head) {
    dept.head = head;
  }
  await dept.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, dept, "Department is Updated Successfully"));
});
const addDoctors = asyncHandler(async (req, res) => {
  const {deptId} = req.params;
  if (!deptId) {
    throw new ApiError(400, "Please Provide Department ID");
  }
  let doctorIds = req.body;
  if (!doctorIds) {
    throw new ApiError(401, "Doctor ID's are not provided");
  }
  if (!Array.isArray(doctorIds)) {
    doctorIds = [doctorIds];
  }
  const updatedDept = await Department.findByIdAndUpdate(
    deptId,
    {
      $addToSet: {
        doctors: { $each: doctorIds }, // for avoiding duplications
      },
    },
    { new: true }
  );

  if (!updatedDept) {
    throw new ApiError(401, "Departments are not Updated Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedDept,
        "Doctors are Added Successfully in the Department"
      )
    );
});
const addPatients = asyncHandler(async (req, res) => {
  const {deptId} = req.params;
  if (!deptId) {
    throw new ApiError(400, "Please Provide Department ID");
  }
  let patientIds = req.body;
  if (!patientIds) {
    throw new ApiError(401, "Doctor ID's are not provided");
  }
  if (!Array.isArray(patientIds)) {
    patientIds = [patientIds];
  }
  const updatedDept = await Department.findByIdAndUpdate(
    deptId,
    {
      $addToSet: {
        patients: { $each: patientIds }, // for avoiding duplications
      },
    },
    { new: true }
  );

  if (!updatedDept) {
    throw new ApiError(401, "Departments are not Updated Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedDept,
        "Doctors are Added Successfully in the Department"
      )
    );
});

const getDepartmentDetails = asyncHandler(async (req, res) => {
  const { deptId } = req.params;
  if (!deptId) {
    throw new ApiError(401, "Please Provide Department IDs");
  }
  const deptDetails = await Department.findById(deptId)
    .populate("hospital", "name city")
    .populate(
      {
        path: "head.user_id",
        select: "name email",
      },
      {
        path: "head",
        select: "qualification experienceInYears",
      }
    )
    .populate("doctors")
    .populate("patients");

  const totalDoctors = await Department.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(deptId) },
    },
    {
      $project: {
        $size: "$doctors",
      },
    },
  ]);
  if (!totalDoctors) {
    throw new ApiError(404, "Total Doctors Not Found");
  }
  const totalPatients = await Department.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(deptId) },
    },
    {
      $project: {
        $size: "$patients",
      },
    },
  ]);
  if (!totalPatients) {
    throw new ApiError(404, "Total Doctors Not Found");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        Details: deptDetails,
        TotalDoctors: totalDoctors,
        TotalPatients: totalPatients,
      },
      "Department Details Are Fetched Successfully"
    )
  );
});

export {
  createDept,
  updateDept,
  addDoctors,
  addPatients,
  getDepartmentDetails,
};
