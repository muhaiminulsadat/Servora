import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  token: "Sadat",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setToken: (state, value) => {
      state.token = value.payload;
    },
  },
});

export const {setToken} = authSlice.actions;
export default authSlice.reducer;
