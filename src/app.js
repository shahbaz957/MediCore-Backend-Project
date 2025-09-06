import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);

// *********************************** FOR JSON CONFIGURATION ******************************************

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser()); // Used for performing the CRUD operation on the users Session Cookies

// ********************************** Routes Definition ********************************************
import userRouter from "./routes/user.route.js";
import patientRouter from "./routes/patient.route.js";
import doctorRouter from "./routes/doctor.route.js";
import deptRouter from "./routes/departments.route.js";
import hospitalRouter from "./routes/hospital.route.js";
import recordRouter from "./routes/medical_record.route.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patient", patientRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/department", deptRouter);
app.use("/api/v1/hospital", hospitalRouter);
app.use("/api/v1/record", recordRouter);
export { app };
