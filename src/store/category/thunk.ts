import { AxiosError } from "axios";
import { AppDispatch } from "..";
import { API_PATH_ADD_CATEGORIES, API_PATH_DELETE_CATEGORIES, API_PATH_EDIT_CATEGORIES, API_PATH_GET_CATEGORIES } from "../../common/api";
import { axiosInstance } from "../../utils/axios-config";
import { addCategoryFailure, addCategorySuccess, deleteCategoryFailure, deleteCategorySuccess, editCategoryFailure, editCategorySuccess, getCategoriesFailure, getCategoriesSuccess } from "./reducer";
import { Category } from "./types";

export const getCategories = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get(`${API_PATH_GET_CATEGORIES}/${userId}`)
    dispatch(getCategoriesSuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(getCategoriesFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const addCategory = (requestPayload: Category) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post(API_PATH_ADD_CATEGORIES, requestPayload)
    dispatch(addCategorySuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(addCategoryFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const editCategory = (categoryId: string, requestPayload: Category) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.put(`${API_PATH_EDIT_CATEGORIES}/${categoryId}`, requestPayload)
    dispatch(editCategorySuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(editCategoryFailure(err.response?.data))
      throw err.response?.data
    }
  }
}

export const deleteCategory = (categoryId: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.delete(`${API_PATH_DELETE_CATEGORIES}/${categoryId}/${userId}`)
    dispatch(deleteCategorySuccess(response.data))
    return response.data
  } catch (err) {
    if (err instanceof AxiosError) {
      dispatch(deleteCategoryFailure(err.response?.data))
      throw err.response?.data
    }
  }
}