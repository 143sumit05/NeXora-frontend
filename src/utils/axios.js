import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://nexora-backend-rkm0.onrender.com",
    withCredentials: true
});

export default axiosClient;