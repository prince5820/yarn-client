import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://yarn-server-7h5y.onrender.com/'
});