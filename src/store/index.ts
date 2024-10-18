import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from './auth/reducer';
import snackbarReducer from './snackbar/reducer';
import footerReducer from './footer/reducer';
import profileReducer from './profile/reducer';
import categoryReducer from './category/reducer';
import paymentReducer from './payment/reducer';
import contactReducer from './contact/reducer';
import chatReducer from './chat/reducer';

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    snackbarReducer: snackbarReducer,
    footerReducer: footerReducer,
    profileReducer: profileReducer,
    categoryReducer: categoryReducer,
    paymentReducer: paymentReducer,
    contactReducer: contactReducer,
    chatReducer: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: process.env.NODE_ENV !== 'production',
      serializableCheck: process.env.NODE_ENV !== 'production',
    }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;