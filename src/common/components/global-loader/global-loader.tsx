import { useCallback, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../../utils/axios-config";

export const GlobalLoaderConfig = () => {
  const [counter, setCounter] = useState<number>(0);

  const increment = useCallback(() => setCounter((counter: number) => counter + 1), [
    setCounter
  ]); // add to counter
  const decrement = useCallback(() => setCounter((counter: number) => counter - 1), [
    setCounter
  ]); // remove from counter

  const interceptors: any = useMemo(
    () => ({
      request: (config: any) => {
        increment();
        return config;
      },
      response: (response: any) => {
        decrement();
        return response;
      },
      error: (error: Error) => {
        decrement();
        return Promise.reject(error);
      }
    }),
    [increment, decrement]
  ); // create the interceptors

  useEffect(() => {
    // add request interceptors
    axiosInstance.interceptors.request.use(interceptors.request, interceptors.error);
    // add response interceptors
    axiosInstance.interceptors.response.use(interceptors.response, interceptors.error);

    return () => {
      // remove all intercepts when done
      axiosInstance.interceptors.request.eject(interceptors.request);
      axiosInstance.interceptors.request.eject(interceptors.error);
      axiosInstance.interceptors.response.eject(interceptors.response);
      axiosInstance.interceptors.response.eject(interceptors.error);
    };
  }, [interceptors]);

  return [counter > 0];
};