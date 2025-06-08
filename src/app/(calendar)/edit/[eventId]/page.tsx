import EditEvent from "@/app/(ui)/components/EditEvent";

interface EditEventPageProps {
    params: {
        eventId: string;
    };
}

const EditEventPage = ({ params }: EditEventPageProps) => {
    return <EditEvent eventId={params.eventId} />;
};

export default EditEventPage;
