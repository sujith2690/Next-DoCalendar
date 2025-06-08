"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [numberExists, setNumberExists] = useState(true); // assume phone exists initially

  useEffect(() => {
    const fetchUserPhone = async () => {
      setLoading(true);
      try {
        console.log("Fetching user phone...");
        const { data } = await axios.get("/api/user/phone");
        console.log(data,'----------------- data in phone route GET method');
        if (!data.phoneNumberExists) {
          // Client-side navigation to /phone
          router.push("/phone");
        } else {
          setNumberExists(true);
        }
      } catch (error:any) {
        console.error("Error fetching user data:---", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPhone();
  }, [router]);

  if (loading) return <p>Loading user data...</p>;

  return numberExists ? (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to DOCalendar</h1>
      <p className="mt-4 text-lg">User has phone number.</p>
    </main>
  ) : (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to DOCalendar</h1>
      <p className="mt-4 text-lg">User Phone: No number</p>
    </main>
  );
}
