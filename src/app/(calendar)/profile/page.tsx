'use client'

import React, { useEffect, useState } from 'react';
import { getUserProfile, updateProfile } from "@/app/axiosPath/user";
import { useFormik } from 'formik';
import { profileSchema } from '@/validation/profile';
import { toast } from 'react-toastify';
import Loading from '@/app/(ui)/components/Loading';

interface UserProfileProps {
    params: { userId: string };
}

export default function UserProfile({ params }: UserProfileProps) {
    const userId = params.userId;

    const [isEditing, setIsEditing] = useState(false);
    const [view, setView] = useState(false)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setView(true)
            try {
                const { data } = await getUserProfile();
                setFormData({
                    userName: data.userName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    image: data.image || ''
                });
                setImagePreview(data.image || '');
                setView(false)
            } catch (error: any) {
                console.error("Error fetching profile:", error.message);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const formik = useFormik({
        initialValues: formData,
        enableReinitialize: true,
        validationSchema: profileSchema,
        onSubmit: async (values, actions) => {
            setLoading(true);
            try {
                const result = await updateProfile(values);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || "Update failed");
            }
            setLoading(false);
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

    return (
        <>
            {
                view ? <>< Loading /></> :
                    <div className="p-5">
                        <div className="max-w-2xl mx-auto p-6 mt-10 rounded-2xl shadow-xl bg-white">
                            <h2 className="text-2xl font-semibold mb-6 text-center">
                                {isEditing ? "Edit Profile" : "My Profile"}
                            </h2>

                            <div className="flex flex-col items-center mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-3">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <input
                                            type="text"
                                            name="userName"
                                            placeholder="Name"
                                            value={values.userName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {touched.userName && errors.userName && (
                                            <p className="text-sm text-red-500 mt-1">{errors.userName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {touched.email && errors.email && (
                                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Phone Number"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                        />
                                        {touched.phone && errors.phone && (
                                            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-4 px-6 py-2.5 w-full border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-800 hover:bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Updating...
                                            </span>
                                        ) : 'Update Profile'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center text-gray-700 space-y-2">
                                    <p><strong>Name:</strong> {formData.userName}</p>
                                    <p><strong>Email:</strong> {formData.email}</p>
                                    <p><strong>Phone:</strong> {formData.phone}</p>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-medium"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
            }
        </>
    );
}
