import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    diagonsedWith: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
      required: true,
    },
    admittedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    medicalHistory: [
      {
        condition: {
          type: String,
          required: true,
        },
        treatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Doctor",
        },
        notes: {
          type: String,
        },
        medications: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
