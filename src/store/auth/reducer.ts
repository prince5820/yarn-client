import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  checkUser: null,
  checkUserError: null,
  forgetPassword: '',
  forgetPasswordError: '',
  newUser: null,
  newUserError: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // sign-in

    signInSuccess: (state, action) => {
      state.checkUser = action.payload
      state.checkUserError = null
    },
    signInFailure: (state, action) => {
      state.checkUser = null
      state.checkUserError = action.payload
    },

    // forget-password

    forgetPasswordSuccess: (state, action) => {
      state.forgetPassword = action.payload
      state.forgetPasswordError = ''
    },
    forgetPasswordFailure: (state, action) => {
      state.forgetPassword = ''
      state.forgetPasswordError = action.payload
    },

    // sign-up

    signUpSuccess: (state, action) => {
      state.newUser = action.payload
      state.newUserError = ''
    },
    signUpFailure: (state, action) => {
      state.newUser = null
      state.newUserError = action.payload
    }
  }
})

export const {
  signInSuccess,
  signInFailure,
  forgetPasswordSuccess,
  forgetPasswordFailure,
  signUpSuccess,
  signUpFailure
} = authSlice.actions;

export default authSlice.reducer;