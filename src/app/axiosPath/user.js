import axios from 'axios'

export const userPhone = () => axios.get("/api/user/phone");
export const getUserProfile = () => axios.get('/api/user/profile');
export const updateProfile = (profileData) => axios.put('/api/user/profile',profileData);