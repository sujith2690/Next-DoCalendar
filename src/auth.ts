// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [Google],
// })

// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./utils/dbConfig";
import userModel from "./models/userModel";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user }) {
            await connectDB();
            console.log(user, '------------- user in signIn callback');
            // Check if user already exists
            const existingUser = await userModel.findOne({ email: user.email });
            console.log(existingUser,'********** existingUser in signIn callback');
            if (!existingUser) {
                const newUser = await userModel.create({
                    userName: user.name,
                    email: user.email,
                    image: user.image,
                    password: "google-auth", // Placeholder, as Google auth doesn't use a password
                });
                console.log(newUser, '------------- newUser created in signIn callback');
            }
            return true;
        },
    },
});
