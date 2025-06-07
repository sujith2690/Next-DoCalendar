// import { auth, signIn, signOut } from "@/auth";

// export default async function SignIn() {
//   const session = await auth();
//   const user = session?.user;

//   return (
//     <div
//       className="h-screen w-full bg-cover bg-center flex items-center justify-center"
//       style={{
//         backgroundImage:
//           "url('https://images.pexels.com/photos/636237/pexels-photo-636237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
//       }}
//     >
//       <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
//         {user ? (
//           <>
//             <form
//               action={async () => {
//                 "use server";
//                 await signOut({ redirectTo: "/myCalendar" });
//               }}
//               className="mb-6"
//             >
//               <h1 className="text-3xl font-semibold mb-4">
//                 Welcome, {user.name}!
//               </h1>
//               <p className="mb-4 text-gray-700">You're signed in.</p>

//               {/* Phone Number Input */}
//               <div className="mb-4 text-left">
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Enter your phone number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   id="phone"
//                   placeholder="+91 9876543210"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition duration-200"
//               >
//                 Sign Out
//               </button>
//             </form>
//           </>
//         ) : (
//           <form
//             action={async () => {
//               "use server";
//               await signIn("google");
//             }}
//           >
//             <h1 className="text-3xl font-semibold mb-4">Do Calendar</h1>
//             <p className="mb-6 text-gray-700">
//               Please sign in to access your calendar.
//             </p>
//             <button
//               type="submit"
//               className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-200 font-medium"
//             >
//               <img
//                 src="https://botster.io/uploads/category/icon/15/brands-and-logotypes.svg"
//                 alt="Google logo"
//                 className="w-5 h-5"
//               />
//               Sign in with Google
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const { data: session } = useSession();
  const user = session?.user;
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);


  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">

      <div
      >
        <h1 className="text-3xl font-semibold mb-4">Do Calendar</h1>
        <p className="mb-6 text-gray-700">
          Please sign in to access your calendar.
        </p>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-100 transition duration-200 font-medium"
        >
          <img
            src="https://botster.io/uploads/category/icon/15/brands-and-logotypes.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
