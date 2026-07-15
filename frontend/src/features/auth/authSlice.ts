import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  token: "Sadat",
  user: null as any,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setToken: (state, value) => {
      state.token = value.payload;
    },
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const {setToken, setAuth, logout} = authSlice.actions;
export default authSlice.reducer;

