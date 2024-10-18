import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  userProfile: null,
  errorMessage: ''
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {

    // get user by id
    getUserByIdSuccess: (state, action) => {
      state.userProfile = action.payload
      state.errorMessage = ''
    },
    getUserByIdFailure: (state, action) => {
      state.userProfile = null
      state.errorMessage = action.payload
    },

    // update user
    updateUserSuccess: (state, action) => {
      state.userProfile = action.payload
      state.errorMessage = ''
    },
    updateUserFailure: (state, action) => {
      state.userProfile = null
      state.errorMessage = action.payload
    }
  }
})

export const {
  getUserByIdSuccess,
  getUserByIdFailure,
  updateUserSuccess,
  updateUserFailure
} = profileSlice.actions;

export default profileSlice.reducer;