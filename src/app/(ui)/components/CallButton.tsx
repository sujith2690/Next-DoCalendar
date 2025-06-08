"use client"

import axios from 'axios';
import { useState } from 'react';

interface CallButtonProps {
    phoneNumber?: string;
    defaultMessage?: string;
}

export default function CallButton({
    phoneNumber = process.env.NEXT_PUBLIC_DEFAULT_PHONE || '',
    defaultMessage = 'Hello from Next.js!'
}: CallButtonProps) {
    const [isCalling, setIsCalling] = useState<boolean>(false);
    const [callStatus, setCallStatus] = useState<string>('');

    const makeCall = async () => {
        setIsCalling(true);
        setCallStatus('Calling...');

        const to = 6238444374
        const message = "hello"
        
        try {
            const { data } = await axios.post('/api/twilio/call', { to, message });

            setCallStatus(`Call initiated! SID: ${data.sid}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setCallStatus(`Error: ${errorMessage}`);
            console.error('Call failed:', error);
        } finally {
            setIsCalling(false);
        }
    };

    return (
        <div className="call-button-container">
            <button
                onClick={makeCall}
                disabled={isCalling}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isCalling ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-busy={isCalling}
            >
                {isCalling ? 'Calling...' : 'Make Call'}
            </button>
            {callStatus && (
                <p className="mt-2 text-sm text-gray-600">
                    {callStatus}
                </p>
            )}
        </div>
    );
}