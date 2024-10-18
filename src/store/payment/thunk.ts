import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { API_PATH_ADD_PAYMENT, API_PATH_ANALYZE_PAYMENT, API_PATH_DELETE_PAYMENT, API_PATH_EDIT_PAYMENT, API_PATH_GENERATE_PAYMENT_PDF, API_PATH_GET_PAYMENT } from "../../common/api";
import { axiosInstance } from "../../utils/axios-config";
import { addPaymentFailure, addPaymentSuccess, analyzePaymentFailure, analyzePaymentSuccess, deletePaymentFailure, deletePaymentSuccess, editPaymentFailure, editPaymentSuccess, getPaymentFailure, getPaymentSuccess, paymentPdfFailure } from "./reducer";
import { AnalyzePaymentPayload, DownloadPdfPaymentPayload, RequestPayload } from "./types";

export const getPayments = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_PAYMENT}/${userId}`)
    dispatch(getPaymentSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getPaymentFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const addPayment = (requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_ADD_PAYMENT, requestPayload)
    dispatch(addPaymentSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(addPaymentFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const editPayment = (paymentId: number, requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.put(`${API_PATH_EDIT_PAYMENT}/${paymentId}`, requestPayload)
    dispatch(editPaymentSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(editPaymentFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const deletePayment = (paymentId: number, user_id: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.delete(`${API_PATH_DELETE_PAYMENT}/${paymentId}/${user_id}`)
    dispatch(deletePaymentSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(deletePaymentFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const analyzePayment = (requestPayload: AnalyzePaymentPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_ANALYZE_PAYMENT, requestPayload);
    dispatch(analyzePaymentSuccess(response.data));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(analyzePaymentFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const downloadPaymentPdf = (requestPayload: DownloadPdfPaymentPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_GENERATE_PAYMENT_PDF, requestPayload, {
      responseType: 'blob'
    });
    const contentDisposition = response.headers['content-disposition'];
    let fileName;
    if (contentDisposition) {
      const parts = contentDisposition.split('filename=');
      if (parts.length === 2) {
        fileName = parts[1].trim().replace(/^"|"$/g, '');
      }
    }
    return { data: response.data, name: fileName };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.data instanceof Blob) {
        const reader = new FileReader();
        return new Promise((_, reject) => {
          reader.onloadend = () => {
            const errorMessage = reader.result as string; // Convert Blob to string
            dispatch(paymentPdfFailure(errorMessage)); // Dispatch the error message
            reject(errorMessage); // Reject the promise with the error message
          };
          reader.onerror = () => {
            reject("Failed to read error response."); // Handle read errors
          };
          reader.readAsText(err.response?.data); // Read the Blob content as text
        });
      } else {
        dispatch(paymentPdfFailure(err.response?.data));
        throw err.response?.data;
      }
    }
  }
}