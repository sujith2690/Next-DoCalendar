"use client"
import { callCron } from '@/app/axiosPath/user'
import React from 'react'

export default function callPage() {
    const handleCall = async () => {
        const res = await callCron()
        console.log(res, '----------call res')
    }
    return (
        <div className='h-screen flex items-center justify-center'>
            <button className='bg-gray-800 rounded p-2 text-white' onClick={handleCall}>
                Call cron
            </button>
        </div>
    )
}
