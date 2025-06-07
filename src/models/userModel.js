import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please provide a User name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    image: {
        type: String
    },
    phone: {
        value: {
            type: String,
            unique: true,
            // sparse: true // prevents unique conflict if `value` is not set
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    googleAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    },
    googleTokenExpiry: {
        type: Number // timestamp in seconds
    }
});

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
export default userModel;
