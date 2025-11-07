import { getSession, signOut } from 'next-auth/react';
import axios, { AxiosError, AxiosResponse, type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000',
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (request) => {
  const session = await getSession();

  if (session?.token) {
    request.headers.Authorization = `Bearer ${session.token}`;
  }

  return request;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: '/login', redirect: true });
    }
    return Promise.reject(error);
  }
);

export default api;
