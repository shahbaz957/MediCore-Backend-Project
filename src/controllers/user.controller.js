import { User } from "../models/User.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Doctor } from "../models/Doctor.models.js";
import { Patient } from "../models/Patient.models.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    salary,
    qualification,
    experienceInYears,
    worksInHospitals,
    diagonsedWith,
    address,
    age,
    bloodGroup,
    gender,
    admittedIn,
    medicalHistory,
  } = req.body;
  const picturePath = req.file?.path;
  if (
    [email, name, password].some((field) => field?.trim() === "") // if one is true whole become the true
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  if (!picturePath) {
    throw new ApiError(404, "Please Provide the Picture");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(403, "User Already Existed with this Email");
  }
  const picture = await uploadCloudinary(picturePath);
  if (!picture) {
    throw new ApiError(401, "Picture is not uploaded on Cloudinary");
  }
  // Create an instance of User
  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
    picture: {
      url: picture.url,
      public_id: picture.public_id,
    },
  });
  if (!user) {
    throw new ApiError(403, "User is Not created Successfully");
  }
  let profile;
  if (role === "Doctor") {
    profile = await Doctor.create({
      user_id: user._id,
      salary: salary,
      qualification: qualification,
      experienceInYears: experienceInYears,
      worksInHospitals: worksInHospitals || [],
    });
  }
  if (role === "Patient") {
    profile = await Patient.create({
      user_id: user._id,
      diagonsedWith: diagonsedWith,
      address: address,
      age: age,
      bloodGroup: bloodGroup,
      gender: gender,
      admittedIn: admittedIn,
      medicalHistory: Array.isArray(medicalHistory)
        ? medicalHistory
        : [medicalHistory] || [],
    });
  }
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(404, "User is not fetched Successfully");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, profile },
        "User is Created Successfully"
      )
    );
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User is Not Found ID is incorrect");
    }
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(401, "Error Occured While generating Tokens");
  }
};

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  // retrieve the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "No user Exist with this Email");
  }
  const validPassword = user.isPasswordCorrect(password);
  if (!validPassword) {
    throw new ApiError(401, "Provided Password is invalid");
  }
  const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  let loggedInUser;
  if (user.role === "Doctor") {
    const doctor = await Doctor.findOne({ user_id: user._id }).populate(
      "worksInHospitals"
    );
    loggedInUser = {
      ...user.toObject(),
      doctor,
    };
  }
  if (user.role === "Patient") {
    const patient = await Patient.findOne({ user_id: user._id }).populate(
      "admittedIn"
    );
    loggedInUser = {
      ...user.toObject(),
      patient,
    };
  }
  if (!loggedInUser) {
    throw new ApiError(401, "Logged IN user is not created");
  }
  const options = {
    httpOnly: true, // This is for setting the standards of Cookie how it is sent httpOnly means it will only be manipulated from server side although it is shown on frontend or client side or browser but it cannot be manipulated from there
    secure: true,
  };
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "Logged In Successfully"));
});

// Secured Route Means You have the Access of Req.User ~:):):):):):)

const logout = asyncHandler(async (req, res) => {
  // first of all we need user object cuz it is obvious if user is requesting at logout route he must be login and we have its user object in req
  if (!req.user?._id) {
    throw new ApiError(
      401,
      "UnAuthorized Access User object is not in Request"
    );
  }
  const loggedOutUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  if (!loggedOutUser) {
    throw new ApiError(401, "Logged is Unsuccessfull");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is absent in Request");
  }
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!decodedToken) {
    throw new ApiError(401, "Refresh Tokens are Invalid");
  }
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new ApiError(400, "User is Not fetched");
  }
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const { accessToken, refreshToken: newRefreshToken } = await
    generateAccessAndRefreshTokens(user._id);
  const options = {
    httpOnly: true,
    secure: false,
  };
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "New Access and Refresh tokens are generated"
      )
    );
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!name && !(oldPassword && newPassword)) {
    throw new ApiError(
      400,
      "Please provide at least a name or password to update"
    );
  }

  if (oldPassword && newPassword) {
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
      throw new ApiError(401, "Old password is incorrect");
    }
    user.password = newPassword;
  }

  // Handle name update
  if (name) {
    user.name = name;
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const updateUserPicture = asyncHandler(async (req, res) => {
  const picturePath = req.file?.path;
  if (!picturePath) {
    throw new ApiError(401, "Please Provide the Picture");
  }
  const picture = await uploadCloudinary(picturePath);
  if (!picture) {
    throw new ApiError(401, "Picture is not Uploaded to cloudinary");
  }
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  // DESTROY THE PREVIOUS IMAGE
  const previousImage = user.picture.public_id;
  if (previousImage) {
    await cloudinary.uploader.destroy(previousImage);
  }
  // Save the New Image url and public_Id in database
  user.picture.url = picture.url;
  user.picture.public_id = picture.public_id;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Picture is Updated Successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User is Fetched Correctly"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not Found");
  }
  if (user.role === "Doctor") {
    await Doctor.findByIdAndDelete({ user_id: user._id });
  }
  if (user.role === "Patient") {
    await Patient.findByIdAndDelete({ user_id: user._id });
  }

  // Destroying the images of them from cloudinary
  if (user.picture.public_id) {
    await cloudinary.uploader.destroy(user.picture.public_id);
  }
  await User.findOneAndDelete(user._id);
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User is Deleted Successfully"));
});

export {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  updateUserProfile,
  updateUserPicture,
  getUserProfile,
  deleteUser,
};
