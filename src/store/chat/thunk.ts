import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { API_PATH_GET_INITIAL_MESSAGES, API_PATH_GET_PDF_DOC, API_PATH_GET_TRANSACTION, API_PATH_GET_UNREAD_MESSAGES, API_PATH_GET_USERS_LIST, API_PATH_SEND_MESSAGES, API_PATH_SENT_PDF_MAIL } from "../../common/api";
import { axiosInstance } from "../../utils/axios-config";
import { getPdfFailure, getTransactionFailure, getUserListFailure, getUserListSuccess, sentMailPdfFailure, sentMailPdfSuccess } from "./reducer";
import { PdfRequestPayload, TransactionRequestPayload } from "./types";

export const getUsersList = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(API_PATH_GET_USERS_LIST)
    dispatch(getUserListSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getUserListFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const getPdfDoc = (requestPayload: PdfRequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_GET_PDF_DOC, requestPayload, {
      responseType: 'blob'
    })
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response && err.response.data instanceof Blob) {
        const reader = new FileReader();
        return new Promise((_, reject) => {
          reader.onloadend = () => {
            const errorMessage = reader.result as string; // Convert Blob to string
            dispatch(getPdfFailure(errorMessage)); // Dispatch the error message
            reject(errorMessage); // Reject the promise with the error message
          };
          reader.onerror = () => {
            reject("Failed to read error response."); // Handle read errors
          };
          reader.readAsText(err.response?.data); // Read the Blob content as text
        });
      } else {
        dispatch(getPdfFailure(err.response?.data));
        throw err.response?.data;
      }
    }
  }
}

export const sentPdfInMail = (requestPayload: PdfRequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_SENT_PDF_MAIL, requestPayload);
    dispatch(sentMailPdfSuccess(response.data));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(sentMailPdfFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const getTransactionsByUser = (requestPayload: TransactionRequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_GET_TRANSACTION, requestPayload);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getTransactionFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const loadInitialMessages = (senderId: number, receiverId: number) => async () => {
  try {
    const response = await axiosInstance.post(API_PATH_GET_INITIAL_MESSAGES, { senderId, receiverId });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data;
    }
  }
}

export const getUnreadMessages = (receiverId: number) => async () => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_UNREAD_MESSAGES}/${receiverId}`);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data;
    }
  }
}

export const sendMessageToUser = (formData: FormData) => async () => {
  try {
    const response = await axiosInstance.post(API_PATH_SEND_MESSAGES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err.response?.data;
    }
  }
}