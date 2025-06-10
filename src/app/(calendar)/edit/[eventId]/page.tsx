import EditEvent from '@/app/(ui)/components/EditEvent';
import React from 'react'

export default async function EditEventPage({ params, }: { params: Promise<{ eventId: string }>; }) {
    const eventId = (await params).eventId
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return (
        <EditEvent eventId={eventId} />
    )
}

