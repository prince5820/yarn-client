import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  msg: '',
  className: ''
}

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.msg = action.payload.msg
      state.className = action.payload.className
    },
    clearMessage: (state) => {
      state.msg = ''
      state.className = ''
    }
  }
})

export const { setMessage, clearMessage } = snackbarSlice.actions;

export default snackbarSlice.reducer;