// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [Google],
// })

// auth.ts
// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";
// import { connectDB } from "./utils/dbConfig";
// import userModel from "./models/userModel";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [Google],
//     callbacks: {
//         async signIn({ user }) {
//             await connectDB();
//             console.log(user, '------------- user in signIn callback');
//             // Check if user already exists
//             const existingUser = await userModel.findOne({ email: user.email });
//             console.log(existingUser,'********** existingUser in signIn callback');
//             if (!existingUser) {
//                 const newUser = await userModel.create({
//                     userName: user.name,
//                     email: user.email,
//                     image: user.image,
//                     password: "google-auth", // Placeholder, as Google auth doesn't use a password
//                 });
//                 console.log(newUser, '------------- newUser created in signIn callback');
//             }
//             return true;
//         },
//     },
// });

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./utils/dbConfig";
import userModel from "./models/userModel";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GoogleProvider],
    callbacks: {
        // 1. Store user in DB on first sign-in
        async signIn({ user }) {
            await connectDB();

            let dbUser = await userModel.findOne({ email: user.email });

            if (!dbUser) {
                dbUser = await userModel.create({
                    userName: user.name,
                    email: user.email,
                    image: user.image,
                    password: "google-auth",
                });
            }

            return true;
        },

        // 2. Add user ID to the JWT
        async jwt({ token, user }) {
            if (user) {
                await connectDB();
                const dbUser = await userModel.findOne({ email: user.email });
                if (dbUser) {
                    return {
                        _id: dbUser._id.toString(),
                        userName: dbUser.userName,
                        // optionally, keep email if you want
                        email: dbUser.email,
                    };
                }
            }
            return token; // return existing token if no user
        },

        //  3. Expose that user ID on the session
        async session({ session, token }) {
            // console.log(token, '------------- token in session callback');
            if (session.user && token) {
                session.user._id = token._id as string;
                session.user.userName = token.userName as string;
            }
            // console.log(session, '------------- session in session callback');
            return session;
        },
    },
});
