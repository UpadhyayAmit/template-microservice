import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserRole } from '../../services/auth';

const initialAuthState = {
  usernName: null,
  isRoleLoaded: false,
  isRoleLoading: false,
  userById: null,
  emailId: null,
  rolePrivileges: [],
  userRole: null,
  loading: false,
  error: null,
};

export const getRoleBaseOnUser = createAsyncThunk('auth/getRoleBaseOnUser', async (data, { rejectWithValue }) => {
  try {
    const response = await fetchUserRole(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setAuth: (state, action) => {
      const { accessToken, userName, name, idToken } = action.payload;
      state.usernName = userName;
      state.accessToken = accessToken;
      state.idToken = idToken;
      state.name = name;
      state.userby = userName ? userName.split('@')[0] : null;
      return state;
    },
    clearAuth: (state) => {
      state.usernName = null;
      state.accessToken = null;
      state.idToken = null;
      state.name = null;
      state.userby = null;
      return state;
    },
    setUserName: (state, action) => {
      state.usernName = action.payload;
    },
    setEmailId: (state, action) => {
      state.emailId = action.payload;
    },
    setUserById: (state, action) => {
      state.userById = action.payload;
    },
    setRolePrivileges: (state, action) => {
      state.rolePrivileges = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoleBaseOnUser.pending, (state) => {
        state.isRoleLoading = true;
        state.error = null;
      })
      .addCase(getRoleBaseOnUser.fulfilled, (state, action) => {
        state.isRoleLoading = false;
        state.isRoleLoaded = true;
        state.rolePrivileges = action.payload.rolePrivileges || [];
        state.userRole = action.payload.userRole || null;
      })
      .addCase(getRoleBaseOnUser.rejected, (state, action) => {
        state.isRoleLoading = false;
        state.isRoleLoaded = false;
        state.error = action.payload || 'Failed to fetch user role';
      });
  },
});

export const { setAuth, clearAuth, setUserName, setEmailId, setUserById, setRolePrivileges, setUserRole } = authSlice.actions;
export const selectAuth = (state) => state.auth;
