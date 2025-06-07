"use client";
import React, { useEffect } from 'react';
import { auth } from "@/auth";
import { myEvents } from '@/app/axiosPath/events';

export default async function MyCalender() {

    // useEffect(() => {
    //     const getMyCalender = async () => {
    //         const response = await myEvents()
    //     };
    //     getMyCalender();
    // }, [])




    return (
        <section className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold">My Calendar</h1>
            <p className="mt-4 text-lg">This is your personal calendar page.</p>
        </section>
    );
}