import axios from 'axios'

export const createNewEvent = (data) => axios.post('/api/events', data);
export const myEvents = () => axios.get('/api/events');
