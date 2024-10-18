import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { API_PATH_UPDATE_USER, API_PATH_USER_BY_ID } from "../../common/api";
import { axiosInstance } from "../../utils/axios-config";
import { getUserByIdFailure, getUserByIdSuccess, updateUserFailure, updateUserSuccess } from "./reducer";
import { User } from "../auth/types";

export const getUserById = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_USER_BY_ID}/${userId}`)
    dispatch(getUserByIdSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getUserByIdFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const updateUser = (userId: string, requestPayload: User) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.put(`${API_PATH_UPDATE_USER}/${userId}`, requestPayload)
    dispatch(updateUserSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(updateUserFailure(err.response?.data))
      throw err.response?.data
    }
  }
}