import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  userList: null,
  sentMailPdf: '',
  errorMessage: ''
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {

    // get users
    getUserListSuccess: (state, action) => {
      state.userList = action.payload
      state.errorMessage = ''
    },
    getUserListFailure: (state, action) => {
      state.userList = null
      state.errorMessage = action.payload
    },

    // generate pdf
    getPdfFailure: (state, action) => {
      state.errorMessage = action.payload
    },

    // sent mail pdf
    sentMailPdfSuccess: (state, action) => {
      state.sentMailPdf = action.payload
      state.errorMessage = ''
    },
    sentMailPdfFailure: (state, action) => {
      state.sentMailPdf = ''
      state.errorMessage = action.payload
    },

    // transaction
    getTransactionFailure: (state, action) => {
      state.errorMessage = action.payload
    }
  }
})

export const {
  getUserListSuccess,
  getUserListFailure,
  getPdfFailure,
  sentMailPdfSuccess,
  sentMailPdfFailure,
  getTransactionFailure
} = chatSlice.actions;

export default chatSlice.reducer;