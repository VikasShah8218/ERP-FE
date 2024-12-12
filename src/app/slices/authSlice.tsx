import { createSlice } from "@reduxjs/toolkit";
// import { loginUser ,logoutUser} from "../../globals/auth";
import { loginUser ,logoutUser} from "../../globals/auth";
import { loadUserInfo, checkInitialAuth } from "../../globals/auth";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: checkInitialAuth(),
    user: loadUserInfo(),
  },
  reducers: {
    login: (state, action) => {
      const token = action.payload.token.access
      delete (action.payload).token
      loginUser(token, action.payload);
      state.authenticated = true;
    },
    logout: (state) => {
      state.authenticated = false;
      logoutUser();
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
