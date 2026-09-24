import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const newPassword = "Neeraj@123";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
            { email: "neeraj@gmail.com" },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("User not found");
        } else {
            console.log("Password reset successfully");
            console.log("Email:", user.email);
            console.log("New password:", newPassword);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

resetPassword();