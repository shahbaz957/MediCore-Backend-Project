import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path : "./.env"
})
console.log("Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary API KEY", process.env.CLOUDINARY_API_KEY);
console.log("Cloudinary API_SECRET:", process.env.CLOUDINARY_API_SECRET);

connectDB().
then(
    app.listen(process.env.PORT ||8000 , (err)=> {
        if (err) console.log(`ERROR is Occured While Server Setup`)
        console.log(`Server is listening at ${process.env.PORT ||8000}`)
    })
).catch(
    () => {
        console.log(`MONGODB is Not Perfectly Configured !!!!`)
    }
)