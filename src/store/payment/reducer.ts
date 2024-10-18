import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  payments: null,
  newPayment: null,
  editPayment: null,
  deletePayment: null,
  analyzePayment: null,
  errorMessage: ''
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {

    // get Payment list
    getPaymentSuccess: (state, action) => {
      state.payments = action.payload
      state.errorMessage = ''
    },
    getPaymentFailure: (state, action) => {
      state.payments = null
      state.errorMessage = action.payload
    },

    // add payment
    addPaymentSuccess: (state, action) => {
      state.newPayment = action.payload
      state.errorMessage = ''
    },
    addPaymentFailure: (state, action) => {
      state.newPayment = null
      state.errorMessage = action.payload
    },

    // edit payment
    editPaymentSuccess: (state, action) => {
      state.editPayment = action.payload
      state.errorMessage = ''
    },
    editPaymentFailure: (state, action) => {
      state.editPayment = null
      state.errorMessage = action.payload
    },

    // delete payment
    deletePaymentSuccess: (state, action) => {
      state.deletePayment = action.payload
      state.errorMessage = ''
    },
    deletePaymentFailure: (state, action) => {
      state.deletePayment = null
      state.errorMessage = action.payload
    },

    // analyze Payment
    analyzePaymentSuccess: (state, action) => {
      state.analyzePayment = action.payload
      state.errorMessage = ''
    },
    analyzePaymentFailure: (state, action) => {
      state.analyzePayment = null
      state.errorMessage = action.payload
    },

    // payment pdf
    paymentPdfFailure: (state, action) => {
      state.errorMessage = action.payload
    }
  }
})

export const {
  getPaymentSuccess,
  getPaymentFailure,
  addPaymentSuccess,
  addPaymentFailure,
  editPaymentSuccess,
  editPaymentFailure,
  deletePaymentSuccess,
  deletePaymentFailure,
  analyzePaymentSuccess,
  analyzePaymentFailure,
  paymentPdfFailure
} = paymentSlice.actions;

export default paymentSlice.reducer;