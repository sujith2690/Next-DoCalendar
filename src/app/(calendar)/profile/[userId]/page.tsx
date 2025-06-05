// export const metadata = {
//     // title: "Profile DcCalendar",
// };

import { notFound } from "next/navigation";
const UserProfile = async ({ params }: { params: { userId: string } }) => {
    const { userId } = params;
    if (parseInt(userId) > 10) {
        notFound()
    }
    return (
        <div>UserProfile -- {userId}</div>
    );
};

export default UserProfile;