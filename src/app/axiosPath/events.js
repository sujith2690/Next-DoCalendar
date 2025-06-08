import axios from 'axios'

export const createNewEvent = (data) => axios.post('/api/events', data);
export const myEvents = () => axios.get('/api/events');
export const deleteEvent = (eventId) => axios.delete(`/api/events?eventId=${eventId}`);
export const getGoogleEvent = (eventId) => axios.get(`/api/events/${eventId}`);
export const updateEventNow = (updatedData) => axios.put('/api/events', updatedData);
