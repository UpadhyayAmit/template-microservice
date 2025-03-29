import { getRole, AddRole, UpdateRole } from '../../services/role';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialRoleState = {
  roleList: [],
  isDataLoaded: false,
  isDataLoading: false,
  isInsertLoading: false,
  isInsertLoaded: false,
  isUpdateLoading: false,
  isUpdateLoaded: false,

  roleResponse: [],
  roleInsertResponse: [],
  roleUpdateResponse: [],
  rolePrivileges: [],
  loading: false,
  error: null,
};

export const getRoleData = createAsyncThunk('role/getRoleData', async (data, { rejectWithValue }) => {
  try {
    const response = await getRole(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addRoleData = createAsyncThunk('role/addRoleData', async (data, { rejectWithValue }) => {
  try {
    const response = await AddRole(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateRoleData = createAsyncThunk('role/updateRoleData', async (data, { rejectWithValue }) => {
  try {
    const response = await UpdateRole(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const roleSlice = createSlice({
  name: 'role',
  initialState: initialRoleState,
  reducers: {
    clearRole: (state) => {
      Object.assign(state, initialRoleState);
      return state;
    },
    setRoleResponse: (state, action) => {
      state.roleResponse = action.payload;
    },
    setRoleInsertResponse: (state, action) => {
      state.roleInsertResponse = action.payload;
    },
    setRoleUpdateResponse: (state, action) => {
      state.roleUpdateResponse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoleData.pending, (state) => {
        state.isDataLoading = true;
      })
      .addCase(getRoleData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.isDataLoading = false;
          state.isDataLoaded = true;
          state.roleList = action.payload;
          state.roleList = [];
          return state;
        }

        state.isDataLoading = false;
        state.isDataLoaded = true;
        state.roleList = action.payload;
      })
      .addCase(getRoleData.rejected, (state, action) => {
        state.isDataLoading = false;
        console.error('Error fetching role data:', action.payload);
      })
      .addCase(addRoleData.pending, (state) => {
        state.isInsertLoading = true;
      })
      .addCase(addRoleData.fulfilled, (state, action) => {
        state.isInsertLoading = false;
        state.isInsertLoaded = true;
        state.roleInsertResponse = action.payload;
      })
      .addCase(addRoleData.rejected, (state, action) => {
        state.isInsertLoading = false;
        console.error('Error adding role data:', action.payload);
      })
      .addCase(updateRoleData.pending, (state) => {
        state.isUpdateLoading = true;
      })
      .addCase(updateRoleData.fulfilled, (state, action) => {
        state.isUpdateLoading = false;
        state.isUpdateLoaded = true;
        state.roleUpdateResponse = action.payload;
      })
      .addCase(updateRoleData.rejected, (state, action) => {
        state.isUpdateLoading = false;
        console.error('Error updating role data:', action.payload);
      });
  },
});

export const { clearRole, setRoleResponse, setRoleInsertResponse, setRoleUpdateResponse } = roleSlice.actions;
export default roleSlice.reducer;
