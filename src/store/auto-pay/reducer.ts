import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  errorMessage: ''
}

const autoPaySlice = createSlice({
  name: 'autoPay',
  initialState,
  reducers: {

    // get auto pay by userId
    getAutoPayFailure: (state, action) => {
      state.errorMessage = action.payload
    },

    // get auto pay by id
    getAutoPayByIdFailure: (state, action) => {
      state.errorMessage = action.payload
    },

    // add auto pay
    addAutoPayFailure: (state, action) => {
      state.errorMessage = action.payload
    },

    // edit auto pay
    editAutoPayFailure: (state, action) => {
      state.errorMessage = action.payload
    },

    // delete auto pay
    deleteAutoPayFailure: (state, action) => {
      state.errorMessage = action.payload
    }
  }
})

export const {
  getAutoPayFailure,
  getAutoPayByIdFailure,
  addAutoPayFailure,
  editAutoPayFailure,
  deleteAutoPayFailure
} = autoPaySlice.actions;

export default autoPaySlice.reducer;