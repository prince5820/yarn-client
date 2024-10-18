import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  categories: null,
  addCategory: null,
  editCategory: '',
  deleteCategory: '',
  errorMessage: ''
}

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {

    // get list of all categories
    getCategoriesSuccess: (state, action) => {
      state.categories = action.payload
      state.errorMessage = ''
    },
    getCategoriesFailure: (state, action) => {
      state.categories = null
      state.errorMessage = action.payload
    },

    // add category

    addCategorySuccess: (state, action) => {
      state.addCategory = action.payload
      state.errorMessage = ''
    },
    addCategoryFailure: (state, action) => {
      state.addCategory = null
      state.errorMessage = action.payload
    },

    // edit category

    editCategorySuccess: (state, action) => {
      state.editCategory = action.payload
      state.errorMessage = ''
    },
    editCategoryFailure: (state, action) => {
      state.editCategory = ''
      state.errorMessage = action.payload
    },

    // delete category

    deleteCategorySuccess: (state, action) => {
      state.deleteCategory = action.payload
      state.errorMessage = ''
    },
    deleteCategoryFailure: (state, action) => {
      state.deleteCategory = ''
      state.errorMessage = action.payload
    }
  }
})

export const {
  getCategoriesSuccess,
  getCategoriesFailure,
  addCategorySuccess,
  addCategoryFailure,
  editCategorySuccess,
  editCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure
} = categorySlice.actions;

export default categorySlice.reducer;