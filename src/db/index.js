import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODBURI}/${DB_NAME}`
    );
    console.log(
      `MongoDB is connected at HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`DataBase Connection Error : ${error}`);
    process.exit(1); // exit the process without doing anything this is core Node JS Functionality
  }
};
export default connectDB;
