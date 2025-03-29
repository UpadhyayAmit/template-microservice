import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMasterData } from '../../services/masterData';

const initialMasterDataState = {
  masterResponse: [],
};

export const getMasterData = createAsyncThunk('masterData/getMasterData', async (data, { rejectWithValue }) => {
  try {
    const response = await fetchMasterData(data.url, data.data, data.requestType);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState: initialMasterDataState,
  reducers: {
    setMasterResponse: (state, action) => {
      state.masterResponse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.masterResponse = action.payload;
      })
      .addCase(getMasterData.rejected, (state, action) => {
        console.error('Error fetching master data:', action.payload);
      });
  },
});

export const { setMasterResponse } = masterDataSlice.actions;

export default masterDataSlice.reducer;
export const selectMasterData = (state) => state.masterData.masterResponse;
