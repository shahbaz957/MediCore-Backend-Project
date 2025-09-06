import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(
        401,
        "UnAuthorized Access Tokens is Not Present Please Login"
      );
    }
    const isVerified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // returns Payload
    const user = await User.findById(isVerified?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Tokens are Invalid");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "UnAuthorized Access" || error.message);
  }
});
