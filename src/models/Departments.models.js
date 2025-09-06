import mongoose, { mongo } from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Cardiology, Neurology, etc.
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    head : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Doctor"
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
