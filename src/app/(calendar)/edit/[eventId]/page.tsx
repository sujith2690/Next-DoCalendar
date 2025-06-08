import EditEvent from "@/app/(ui)/components/EditEvent";

const EditEventPage = async ({ params }: { params: { eventId: string } }) => {
    return await <EditEvent eventId={params.eventId} />;
};

export default EditEventPage;
