


import { auth, signIn, signOut } from "@/auth"

export default async function SignIn() {

  const session = await auth()
  console.log(session, '------------- session in login page')

  const user = session?.user

  return user ? (
    <form className="flex flex-col items-center justify-center h-screen"
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
      <p className="mb-6">You are already signed in.</p>
      <button type="submit"
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </form>
  ) : (
    <form className="flex flex-col items-center justify-center h-screen"
      action={async () => {
        "use server"
        await signIn("google",{redirectTo: "/myCalendar"})
      }}
    >
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <p className="mb-6">Please sign in to continue.</p>
      <button type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Sign In with Google
      </button>
    </form>
  )
}

