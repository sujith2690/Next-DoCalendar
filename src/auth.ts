

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { connectDB } from "./utils/dbConfig";
// import userModel from "./models/userModel";
// export const { handlers, signIn, signOut, auth } = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//             authorization: {
//                 params: {
//                     scope: 'openid email profile https://www.googleapis.com/auth/calendar',
//                     access_type: 'offline',
//                     prompt: 'consent'
//                 }
//             }
//         })
//     ],
//     callbacks: {
//         // 1. Store user in DB and save Google tokens
//         async signIn({ user, account }) {
//             await connectDB();

//             let dbUser = await userModel.findOne({ email: user.email });

//             if (!dbUser) {
//                 dbUser = await userModel.create({
//                     userName: user.name,
//                     email: user.email,
//                     image: user.image,
//                     password: "google-auth",
//                     googleAccessToken: account?.access_token,
//                     googleRefreshToken: account?.refresh_token,
//                     googleTokenExpiry: account?.expires_at
//                 });
//             } else {
//                 // Update tokens if user exists
//                 dbUser.googleAccessToken = account?.access_token;
//                 dbUser.googleRefreshToken = account?.refresh_token;
//                 dbUser.googleTokenExpiry = account?.expires_at;
//                 await dbUser.save();
//             }

//             return true;
//         },
//         // 2. Add user ID and Google tokens to JWT
//         async jwt({ token, user, account }) {
//             if (user) {
//                 await connectDB();
//                 const dbUser = await userModel.findOne({ email: user.email });
//                 if (dbUser) {
//                     token._id = dbUser._id.toString();
//                     token.userName = dbUser.userName;
//                     token.googleAccessToken = account?.access_token || dbUser.googleAccessToken;
//                     token.googleRefreshToken = account?.refresh_token || dbUser.googleRefreshToken;
//                     token.googleTokenExpiry = account?.expires_at || dbUser.googleTokenExpiry;
//                 }
//             }
//             // Refresh token if expired
//             if (
//                 token.googleRefreshToken &&
//                 token.googleTokenExpiry &&
//                 Date.now() > (token.googleTokenExpiry as number) * 1000

//             ) {
//                 try {
//                     const response = await fetch('https://oauth2.googleapis.com/token', {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                         body: new URLSearchParams({
//                             client_id: process.env.GOOGLE_CLIENT_ID as string,
//                             client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
//                             grant_type: 'refresh_token',
//                             refresh_token: token.googleRefreshToken as string, // 🛠️ Type assertion here
//                         }),
//                     });

//                     const data = await response.json();
//                     token.googleAccessToken = data.access_token;
//                     token.googleTokenExpiry = Date.now() + data.expires_in * 1000;

//                     // Update in DB
//                     await connectDB();
//                     await userModel.updateOne(
//                         { _id: token._id },
//                         {
//                             googleAccessToken: data.access_token,
//                             googleTokenExpiry: Date.now() + data.expires_in * 1000,
//                         }
//                     );
//                 } catch (error) {
//                     console.error('Error refreshing Google token:', error);
//                 }
//             }
//             return token;
//         },

//         // 3. Expose user info and Google tokens on session
//         async session({ session, token }) {
//             if (session.user && token) {
//                 session.user._id = token._id as string;
//                 session.user.userName = token.userName as string;
//                 session.googleAccessToken = token.googleAccessToken as string;
//             }
//             return session;
//         }
//     },

// });

// // Extend the session type
// declare module "next-auth" {
//     interface Session {
//         user: {
//             _id: string;
//             userName: string;
//             email?: string;
//         };
//         googleAccessToken?: string;
//     }
// }




import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./utils/dbConfig";
import userModel from "./models/userModel";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: 'openid email profile https://www.googleapis.com/auth/calendar',
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        })
    ],
    callbacks: {
        // 1. Store user in DB and save Google tokens
        async signIn({ user, account }) {
            try {
                await connectDB();
                console.log(account?.access_token, '--------A--------- account access token in signIn callback');
                console.log(account?.refresh_token, '--------R---f------ account refresh token in signIn callback');

                let dbUser = await userModel.findOne({ email: user.email });
                if (!dbUser) {
                    dbUser = await userModel.create({
                        userName: user.name,
                        email: user.email,
                        image: user.image,
                        password: "google-auth",
                        googleAccessToken: account?.access_token,
                        googleRefreshToken: account?.refresh_token,
                        googleTokenExpiry: account?.expires_at,
                    });
                } else {
                    dbUser.googleAccessToken = account?.access_token;
                    dbUser.googleTokenExpiry = account?.expires_at;
                    if (account?.refresh_token) {
                        dbUser.googleRefreshToken = account.refresh_token;
                    }
                    await dbUser.save();
                }
            } catch (error: any) {
                console.log('Error in sign in path google-------err------------- ', error.message)
            }
            return true;

        },
        // 2. Add user ID and Google tokens to JWT
        async jwt({ token, user, account }) {
            if (user) {

                await connectDB();
                const dbUser = await userModel.findOne({ email: user.email });
                if (dbUser) {
                    token._id = dbUser._id.toString();
                    token.userName = dbUser.userName;
                    token.googleAccessToken = account?.access_token || dbUser.googleAccessToken;
                    token.googleRefreshToken = account?.refresh_token || dbUser.googleRefreshToken;
                    token.googleTokenExpiry = account?.expires_at || dbUser.googleTokenExpiry;
                }
            }
            if (
                token.googleRefreshToken &&
                token.googleTokenExpiry &&
                Math.floor(Date.now() / 1000) > (token.googleTokenExpiry as number)
            ) {
                try {
                    const response = await fetch('https://oauth2.googleapis.com/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            client_id: process.env.GOOGLE_CLIENT_ID as string,
                            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
                            grant_type: 'refresh_token',
                            refresh_token: token.googleRefreshToken as string,
                        }),
                    });

                    const data = await response.json();

                    if (data.access_token) {
                        const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
                        token.googleAccessToken = data.access_token;
                        token.googleTokenExpiry = expiresAt;

                        await connectDB();
                        await userModel.updateOne(
                            { _id: token._id },
                            {
                                googleAccessToken: data.access_token,
                                googleTokenExpiry: expiresAt,
                            }
                        );
                    } else {
                        console.error("Token refresh failed:--------", data);
                    }
                } catch (error) {
                    console.error("Error refreshing Google token:", error);
                }
            } else if (!token.googleRefreshToken) {
                console.warn("⚠️ No Google refresh token. Cannot refresh access.");
            }
            return token;
        },

        // 3. Expose user info and Google tokens on session
        async session({ session, token }) {
            if (session.user && token) {
                session.user._id = token._id as string;
                session.user.userName = token.userName as string;
                session.googleAccessToken = token.googleAccessToken as string;
            }
            return session;
        }
    },

});

// Extend the session type
declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            userName: string;
            email?: string;
        };
        googleAccessToken?: string;
    }
}