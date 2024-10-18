import { createSlice } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
  contact: null,
  newContact: null,
  editContact: null,
  deleteContact: null,
  errorMessage: ''
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {

    // get contact list
    getContactSuccess: (state, action) => {
      state.contact = action.payload
      state.errorMessage = ''
    },
    getContactFailure: (state, action) => {
      state.contact = null
      state.errorMessage = action.payload
    },

    // add contact
    addContactSuccess: (state, action) => {
      state.newContact = action.payload
      state.errorMessage = ''
    },
    addContactFailure: (state, action) => {
      state.newContact = null
      state.errorMessage = action.payload
    },

    // edit contact
    editContactSuccess: (state, action) => {
      state.editContact = action.payload
      state.errorMessage = ''
    },
    editContactFailure: (state, action) => {
      state.editContact = null
      state.errorMessage = action.payload
    },

    // delete contact
    deleteContactSuccess: (state, action) => {
      state.deleteContact = action.payload
      state.errorMessage = ''
    },
    deleteContactFailure: (state, action) => {
      state.deleteContact = null
      state.errorMessage = action.payload
    }
  }
})

export const {
  getContactSuccess,
  getContactFailure,
  addContactSuccess,
  addContactFailure,
  editContactSuccess,
  editContactFailure,
  deleteContactSuccess,
  deleteContactFailure
} = contactSlice.actions;

export default contactSlice.reducer;