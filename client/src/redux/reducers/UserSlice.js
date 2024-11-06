//A slice includes the state, reducers, and actions in one cohesive structure.
//Redux slice for managing user-related state
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {   //reducers are functions that modify the state
    updateUser: (state, action) => {    // updateUser reducer is called when the user's information is updated
      state.currentUser = action.payload.user;
    },
    loginSuccess: (state, action) => {    // loginSuccess reducer is called when the user logs in successfully
      state.currentUser = action.payload.user;
      localStorage.setItem("foodeli-app-token", action.payload.token);  
    },
    logout: (state) => {                  // logout reducer is called when the user logs out
      state.currentUser = null; 
      localStorage.removeItem("foodeli-app-token");
    },
  },
});

export const { updateUser, loginSuccess, logout } = userSlice.actions;

export default userSlice.reducer;
