import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string;
            email?: string;
            image?: string;
            _id?: string;
            userName?: string;
        };
    }

    interface User {
        _id?: string;
        userName?: string;
    }

    interface JWT {
        _id?: string;
        userName?: string;
    }
}
