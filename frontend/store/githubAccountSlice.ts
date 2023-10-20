import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';
import axios from 'axios';
import moment from 'moment';

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const gitHubProfile = createAsyncThunk(
  'gitHubProfile',
  async (arg: any, { getState }) => {
    const { auth }: any = getState();
    const apiEndpoint = auth.authState
      ? 'github/profile'
      : 'public/github/profile';
    const requestOptions = auth.authState
      ? {
          headers: { Authorization: `Bearer ${auth.authToken}` },
        }
      : {};

    return axios
      .get(`${NEXT_PUBLIC_API_ENDPOINT}/${apiEndpoint}`, {
        ...requestOptions,
        params: { githubUsername: arg.githubUsername },
      })
      .then((response) => {
        return response.data;
      });
  },
);

export const gitHubRepositories = createAsyncThunk(
  'gitHubRepositories',
  async (arg: any, { getState }) => {
    const { auth }: any = getState();
    const apiEndpoint = auth.authState
      ? 'github/repositories'
      : 'public/github/repositories';
    const requestOptions = auth.authState
      ? {
          headers: { Authorization: `Bearer ${auth.authToken}` },
        }
      : {};

    return axios
      .get(`${NEXT_PUBLIC_API_ENDPOINT}/${apiEndpoint}`, {
        ...requestOptions,
        params: { githubUsername: arg.githubUsername },
      })
      .then((response) => {
        console.log(response)
        return response.data;
      });
  },
);

// Type for our state
export interface ProfileStateInterface {
  isLoading: boolean;
  isError: boolean;
  avatar_url: string;
  bio: string;
  email: string;
  followers: number;
  following: number;
  login: string;
  name: string;
  totalVisit: number;
  visitors: VisitorInterface[]
}

export interface VisitorInterface {
  LastVisitTime: string;
  Username: string;
  VisitorAvatar: string;
  VisitorUsername: string;
}

export interface RespositoryInterface {
  private: string;
  name: string;
  description: string;
  updated_at: string;
  updated_at_display: string;
  language: string;
}

export interface RespositoryStateInterface {
  isLoading: boolean;
  isError: boolean;
  data: RespositoryInterface[];
}

export interface GithubAccountSlice {
  profile: ProfileStateInterface;
  repository: RespositoryStateInterface;
}

// Initial state
const initialState: GithubAccountSlice = {
  profile: {
    isLoading: false,
    isError: false,
    avatar_url: '',
    bio: '',
    email: '',
    followers: 0,
    following: 0,
    totalVisit: 0,
    login: '',
    name: '',
    visitors:[]
  },
  repository: {
    isLoading: false,
    isError: false,
    data: []
  }
};

// Actual Slice
export const githubAccountSlice = createSlice({
  name: 'githubAccount',
  initialState,
  reducers: {
    // Action to set the authentication status
    setLogOut(state) {
      console.log(JSON.stringify(state));
      // authLogOutMutation(state)
      console.log(JSON.stringify(state));
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.githubAccount,
      };
    });

    // Builder gitHubProfile
    builder.addCase(gitHubProfile.pending, (state, action) => {
      state.profile.isLoading = true;
    });
    builder.addCase(gitHubProfile.fulfilled, (state, action) => {
      state.profile.isLoading = false;
      const { status, data, description } = action.payload;

      const { avatar_url, bio, email, followers, following, login, name, totalVisit, visitors} = data;
      if (status) {
        state.profile.avatar_url = avatar_url;
        state.profile.bio = bio
        state.profile.email = email
        state.profile.followers = followers;
        state.profile.following = following;
        state.profile.totalVisit = totalVisit;
        state.profile.visitors = visitors || []
        state.profile.login = login;
        state.profile.name = name;
      }
    });
    builder.addCase(gitHubProfile.rejected, (state, action) => {
      state.profile.isError = true;
    });

    // Builder gitHubRepositories
    builder.addCase(gitHubRepositories.pending, (state, action) => {
      state.repository.isLoading = true;
    });
    builder.addCase(gitHubRepositories.fulfilled, (state, action) => {
      state.repository.isLoading = false;
      const { status, data } = action.payload;

      if (status) {
        state.repository.data = data.map((repo: any) => {
          const updated_at = moment(repo.updated_at)
          let updated_at_display = ""

          // Updated last one hour
          if (updated_at > moment().subtract(1, "hour")) {
            updated_at_display = "Updated just now"
          }
          // Updated today
          else if (updated_at.startOf('day') == moment().startOf('day')) {
            updated_at_display = "Updated today"
          }
          // Updated yesterday
          else if (updated_at.startOf('day') > moment().startOf('day').subtract(1, "day")) {
            updated_at_display = "Updated yesteday"
          }
          // Updated this year
          else if (updated_at.startOf("year") == moment().startOf('year')) {
            updated_at_display = "Updated on " + updated_at.format("MMM DD")
          }
          // Updated before this year
          else {
            updated_at_display = "Updated on " + updated_at.format("MMM DD YYYY")
          }

          return {
            ...repo,
            updated_at_display
          }
        });
      }
    });
    builder.addCase(gitHubRepositories.rejected, (state, action) => {
      state.repository.isError = true;
    });
  },
});

export const { setLogOut } = githubAccountSlice.actions;

export const selectGithubAccountState = (state: AppState) =>
  state.githubAccount;

export default githubAccountSlice.reducer;
