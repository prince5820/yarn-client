import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  activeMenu: ''
}

const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload
    }
  }
})

export const { setActiveMenu } = footerSlice.actions;

export default footerSlice.reducer;