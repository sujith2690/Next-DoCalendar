import mongoose from "mongoose"


const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: [true, "Please provide a User name"],
        unique: true
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
        type: String,
        // required: [true, "Please provide a password"]
    },

    // isVerified: {
    //     type: Boolean,
    //     default: false,
    // },
})

const userModel = mongoose.models.users || mongoose.model("users", userSchema)

export default userModel