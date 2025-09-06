import mongoose, { mongo } from "mongoose";

const MedicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    disease: {
      type: String, 
      required: true,
    },
    medications: [
      {
        type: String, 
      },
    ]
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);
