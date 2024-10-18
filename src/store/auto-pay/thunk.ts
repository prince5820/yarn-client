import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { axiosInstance } from "../../utils/axios-config";
import { addAutoPayFailure, deleteAutoPayFailure, editAutoPayFailure, getAutoPayFailure } from "./reducer";
import { RequestPayload } from "./types";
import { API_PATH_ADD_AUTO_PAY, API_PATH_DELETE_AUTO_PAY, API_PATH_EDIT_AUTO_PAY, API_PATH_GET_AUTO_PAY, API_PATH_GET_AUTO_PAY_BY_ID } from "../../common/api";

export const getAutoPay = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_AUTO_PAY}/${userId}`);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getAutoPayFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const getAutoPayById = (paymentId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_AUTO_PAY_BY_ID}/${paymentId}`);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getAutoPayFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const addAutoPayment = (requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_ADD_AUTO_PAY, requestPayload);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(addAutoPayFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const editAutoPayment = (paymentId: number, requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(`${API_PATH_EDIT_AUTO_PAY}/${paymentId}`, requestPayload);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(editAutoPayFailure(err.response?.data));
      throw err.response?.data;
    }
  }
}

export const deleteAutoPay = (paymentId: number, userId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.delete(`${API_PATH_DELETE_AUTO_PAY}/${paymentId}/${userId}`)
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(deleteAutoPayFailure(err.response?.data))
      throw err.response?.data
    }
  }
}