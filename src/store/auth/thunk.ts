import { AxiosError } from "axios"
import { AppDispatch } from ".."
import { API_PATH_FORGET_PASSWORD, API_PATH_SIGN_IN, API_PATH_SIGN_UP } from "../../common/api"
import { axiosInstance } from "../../utils/axios-config"
import { forgetPasswordFailure, forgetPasswordSuccess, signInFailure, signInSuccess, signUpFailure, signUpSuccess } from "./reducer"
import { User } from "./types"

export const signIn = (email: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_SIGN_IN}/${email}`)
    dispatch(signInSuccess(response.data));
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(signInFailure(err.response?.data));
      throw err.response?.data
    }
  }
}

export const forgetPassword = (email: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_FORGET_PASSWORD}/${email}`)
    dispatch(forgetPasswordSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(forgetPasswordFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const signUp = (requestPayload: User) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_SIGN_UP, requestPayload)
    dispatch(signUpSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(signUpFailure(err.response?.data))
      throw err.response?.data
    }
  }
}