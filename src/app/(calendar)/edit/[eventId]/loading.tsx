import React from 'react'

export default function loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-4"></div>
                <p className="text-lg text-gray-700 font-medium">Loading, please wait...</p>
            </div>
        </div>
    )
}
