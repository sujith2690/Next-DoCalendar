'use client'

import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const PhoneNumberPage = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("")
    const [verify, setVerify] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // To show validation errors
    const { data: session } = useSession();
    const user = session?.user;
    // console.log(user, '-----------signed in user');
    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };
    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("User not signed in.");
            return;
        }
        if (!phone) {
            setError("Phone number is required.");
            return;
        }
        if (!validatePhoneNumber(phone)) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }
        setError("");
        try {
            setLoading(true);
            const res = await axios.post("/api/twilio/sentOtp", phone);
            console.log(res, '----------------- res in phone route POST method');
            if (res.status === 200) {
                toast.success("Otp Sent to your Phone number");
                setVerify(true);
                // setPhone("");
                setOtp("")
                redirect("/")
            }
        } catch (error: any) {
            console.error("Error saving phone:", error.message);
            toast.warning("Try again later or change your phone number.");
        } finally {
            setLoading(false);
        }
    };
    const otpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setError("User not signed in.");
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.post("/api/twilio/verifyOtp", { email: user.email, otp, phone });
            console.log(data, '----------------- res in verifyOtp route POST method');
            if (data.status === 200) {
                toast.success("Phone number verified successfully");
                redirect("/");
            } else {
                toast.error("Failed to verify phone number.");
            }
            // setPhone("");
        } catch (error:any) {
            console.error("Error verifying OTP---:", error);
        } finally { 
            setLoading(false);
            setVerify(true);
        }
    }
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
            <h1 className="text-3xl font-semibold mb-4">
                Welcome,
            </h1>
            <p className="mb-4 text-gray-700">You're signed in.</p>
            {
                !verify ?
                    <form onSubmit={handlePhoneSubmit} className="mb-4 text-left">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Enter your phone number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-3
                      ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            autoComplete="tel"
                        />
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200"
                        >
                            {loading ? "Sending..." : "Send Otp"}
                        </button>
                    </form>
                    :
                    <form onSubmit={otpSubmit} className="mb-4 text-left">
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Enter your OTP
                        </label>
                        <input
                            type="number"
                            name="phone"
                            id="phone"
                            placeholder="Only 6 digits"
                            maxLength={6}
                            minLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 mb-3
                      ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                            autoComplete="tel"
                        />
                        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition duration-200"
                        >
                            {loading ? "Verifying..." : "Verify Phone Number"}
                        </button>
                    </form>
            }

        </div>
    )
}

export default PhoneNumberPage;
