// import CallButton from "@/app/(ui)/components/CallButton";
// import { notFound } from "next/navigation";


// const UserProfile = async ({ params }: { params: { userId: string } }) => {
//     const { userId } = params;
//     if (parseInt(userId) > 10) {
//         notFound()
//     }
//     return (
//         <div>UserProfile -- {userId}
//             <div>
//                 <CallButton />
//             </div>
//         </div>
//     );
// };

// export default UserProfile;


import CallButton from '@/app/(ui)/components/CallButton';
import React from 'react'

export default async function UserProfile({ params, }: { params: Promise<{ userId: string }>; }) {
    const userId = (await params).userId
    return (
        <div>UserProfile -- {userId}
            <div>
                <CallButton />
            </div>
        </div>
    )
}
