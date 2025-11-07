/* eslint-disable @typescript-eslint/ban-ts-comment */
import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { signOut } from 'next-auth/react';

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.API_URL || 'http://localhost:3000' });

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('orvalToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AXIOS_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const token = localStorage.getItem('orvalToken');
      if (token) {
        localStorage.removeItem('orvalToken');
        await signOut({ callbackUrl: '/login', redirect: true });
      }
    }
    return Promise.reject(error);
  }
);

export interface CustomError {
  message: string;
}

export const http = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error & CustomError>;
export type BodyType<BodyData> = BodyData;
