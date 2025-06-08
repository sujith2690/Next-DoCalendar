import { auth } from "@/auth";

export const getSession = async () => {
    const session = await auth();
    if (!session || !session.googleAccessToken) {
        return new Response(
            JSON.stringify({ error: "Unauthorized - no access token" }),
            { status: 401 }
        );
    }
    return session
}