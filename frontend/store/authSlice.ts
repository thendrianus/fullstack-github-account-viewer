import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import axios
 from "axios";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const gitHubLogin = createAsyncThunk("gitHubLogin", async (arg: any) => {
  return axios
  .post(`${NEXT_PUBLIC_API_ENDPOINT}/auth/github/login`, {
    code: arg.codeParam,
  })
  .then((response) => {
    return response.data;
  });
});

const authLogOutMutation = (state: AuthState) => {
  Object.assign(state, {
    authState: false,
    email: "",
    githubAccessToken: "",
    githubUsername: "",
    name: "",
    picture: "",
    authToken: ""
  })
}

// Type for our state
export interface AuthState {
  authState: boolean;
  isLoading: boolean,
  isError: boolean
  email: string,
  githubAccessToken: string,
  githubUsername: string,
  name: string,
  picture: string,
  authToken: string,
}

// Initial state
const initialState: AuthState = {
  authState: false,
  isLoading: false,
  isError: false,
  email: "",
  githubAccessToken: "",
  githubUsername: "",
  name: "",
  picture: "",
  authToken: "",
};

// Actual Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to set the authentication status
    setLogOut(state) {
      console.log(JSON.stringify(state))
      authLogOutMutation(state)
      console.log(JSON.stringify(state))
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action : any) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      })

    builder.addCase(gitHubLogin.pending, (state, action) => {
      state.isLoading = true;
    })
    builder.addCase(gitHubLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      const {status, data, token} = action.payload

      const { email, githubAccessToken, name, picture, githubUsername} = data
      if (status) {
        state.authState = true
        state.email= email,
        state.githubAccessToken= githubAccessToken
        state.githubUsername = githubUsername
        state.name= name
        state.picture= picture
        state.authToken = token
      } else {
        authLogOutMutation(state)
      }
    })
    builder.addCase(gitHubLogin.rejected, (state, action) => {
      state.isError = true;
    })
  }

});

export const { setLogOut } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;
