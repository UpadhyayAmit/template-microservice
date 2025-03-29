import { getUser, ModifyUser, AddUser } from '../../services/user';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialUserState = {
  userResponse: [],
  userResponseCount: 0,
  isDataLoading: false,
  isDataLoaded: false,
  isDataUploading: false,
  isDataUploaded: false,
  updateUserResponse: [],
  userResponseStatus: false,
  userResponseMessage: undefined,
};

export const getUserData = createAsyncThunk('user/getUserData', async (data, { rejectWithValue }) => {
  try {
    const response = await getUser(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const modifyUserData = createAsyncThunk('user/modifyUserData', async (data, { rejectWithValue }) => {
  try {
    const response = await ModifyUser(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addUserData = createAsyncThunk('user/addUserData', async (data, { rejectWithValue }) => {
  try {
    const response = await AddUser(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    clearUser: (state) => {
      Object.assign(state, initialUserState);
      return state;
    },
    setUserResponse: (state, action) => {
      state.userResponse = action.payload;
    },
    setUserResponseCount: (state, action) => {
      state.userResponseCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.isDataLoading = true;
        state.isDataLoaded = false;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.isDataLoading = false;
          state.isDataLoaded = true;
          state.userResponse = [];
          state.userResponseCount = 0;
          return state;
        }

        state.isDataLoading = false;
        state.isDataLoaded = true;
        state.userResponse = action.payload.data;
        state.userResponseCount = action.payload.count;
      })
      .addCase(getUserData.rejected, (state, action) => {
        console.error('Error fetching user data:', action.payload);
        state.isDataLoading = false;
        state.isDataLoaded = false;
      })
      .addCase(modifyUserData.pending, (state) => {
        state.isDataUploading = true;
        state.isDataUploaded = false;
      })
      .addCase(modifyUserData.fulfilled, (state, action) => {
        state.isDataUploading = false;
        state.isDataUploaded = true;
        state.updateUserResponse = action.payload.data;
        state.userResponseStatus = action.payload.statusCode === 200 ? true : false;
        state.userResponseMessage = action.payload.message || 'No Message';
      })
      .addCase(modifyUserData.rejected, (state, action) => {
        console.error('Error modifying user data:', action.payload);
        state.isDataUploading = false;
        state.isDataUploaded = false;
      })
      .addCase(addUserData.pending, (state) => {
        state.isDataUploading = true;
        state.isDataUploaded = false;
      });
  },
});

export const { clearUser, setUserResponse, setUserResponseCount } = userSlice.actions;
export default userSlice.reducer;
