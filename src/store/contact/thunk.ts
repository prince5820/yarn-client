import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { API_PATH_CREATE_CONTACT, API_PATH_DELETE_CONTACT, API_PATH_EDIT_CONTACT, API_PATH_GET_CONTACT } from "../../common/api";
import { axiosInstance } from "../../utils/axios-config";
import { addContactFailure, addContactSuccess, deleteContactFailure, deleteContactSuccess, editContactFailure, editContactSuccess, getContactFailure, getContactSuccess } from "./reducer";
import { RequestPayload } from "./types";

export const getContactByUserId = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_CONTACT}/${userId}`)
    dispatch(getContactSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getContactFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const createContact = (requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_CREATE_CONTACT, requestPayload)
    dispatch(addContactSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(addContactFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const editContact = (contactId: string, requestPayload: RequestPayload) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.put(`${API_PATH_EDIT_CONTACT}/${contactId}`, requestPayload)
    dispatch(editContactSuccess(response.data))
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(editContactFailure(err.response?.data))
      throw err.response?.data;
    }
  }
}

export const deleteContact = (contactId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.delete(`${API_PATH_DELETE_CONTACT}/${contactId}/${userId}`)
    if (response) {
      dispatch(deleteContactSuccess(response.data))
      return response.data
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(deleteContactFailure(err.response?.data))
      throw err.response?.data
    }
  }
}