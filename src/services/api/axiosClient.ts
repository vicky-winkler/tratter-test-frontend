import axios from 'axios'

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// authentication might be needed here


export default axiosClient;