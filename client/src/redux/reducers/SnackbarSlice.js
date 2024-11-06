// A Redux slice for managing the state of a snackbar notification in a React application using Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

const initialState = {   //initial values for the snackbar's state
  open: false,   
  message: "",
  severity: "success",
};

const snackbar = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar: (state, action) => {     //This reducer is called to show the snackbar notification
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;  
    },
    closeSnackbar: (state) => {   // // This reducer is called to hide the snackbar.
      state.open = false;
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbar.actions;

export default snackbar.reducer;
