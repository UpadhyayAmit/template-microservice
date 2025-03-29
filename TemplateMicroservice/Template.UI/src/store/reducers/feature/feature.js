import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeature, addFeature, updateFeature } from '../../services/feature/feature';
import { closeConfirmPopup, closeFormPopup } from './popup';

import { toast } from 'react-toastify';

const initialState = {
  featureResponse: [],
  totalCount: 0,
  isDataLoaded: false,
  isDataLoading: false,
  isUpdateLoading: false,
  isUpdateLoaded: false,
  featureUpdateResponse: [],
  filterForm: {
    active: [],
    featureName: [],
  },
  AddForm: {
    active: [],
    featureName: [],
  },
  dropDown: {
    active: [],
  },

  loading: false,
  error: null,
};

export const getFeatureData = createAsyncThunk('feature/getFeatureData', async (_, { rejectWithValue, getState }) => {
  try {
    const { pageIndex, pageSize } = getState().table;
    const { filterForm } = getState().feature;
    const response = await getFeature(pageIndex, pageSize, filterForm);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addFeatureData = createAsyncThunk('feature/addFeatureData', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await addFeature(data);
    await dispatch(getFeatureData()).unwrap();
    await dispatch(clearForm());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(closeFormPopup());
  }
});

export const updateFeatureData = createAsyncThunk('feature/updateFeatureData', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await updateFeature(data);
    await dispatch(getFeatureData()).unwrap();
    await dispatch(clearForm());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(closeFormPopup());
  }
});

export const activateFeatureData = createAsyncThunk('feature/activateFeatureData', async (_, { rejectWithValue, dispatch, getState }) => {
  const addFeature = getState().feature.AddFeature;
  const response = await updateFeature(addFeature);
  try {
    await dispatch(getFeatureData()).unwrap();
    await dispatch(clearForm());
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(closeFormPopup());
  }
});

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    clearFeature: (state) => {
      Object.assign(state, initialState);
      return state;
    },
    setFeatureResponse: (state, action) => {
      state.featureResponse = action.payload;
    },
    setFeatureUpdateResponse: (state, action) => {
      state.featureUpdateResponse = action.payload;
    },
    setFilterForm: (state, action) => {
      state.filterForm = action.payload;
    },
    setAddForm: (state, action) => {
      state.AddForm = action.payload;
    },
    clearFilterForm: (state) => {
      state.filterForm = initialState.filterForm;
    },
    clearForm: (state) => {
      state.AddForm = initialState.AddForm;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureData.pending, (state) => {
        state.isDataLoading = true;
        state.isDataLoaded = false;
      })
      .addCase(getFeatureData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.isDataLoading = false;
          state.isDataLoaded = true;
          state.featureResponse = [];
          state.totalCount = 0;
          return state;
        }

        state.isDataLoading = false;
        state.isDataLoaded = true;
        state.featureResponse = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getFeatureData.rejected, (state, action) => {
        console.error('Error fetching feature data:', action.payload);
      })
      .addCase(addFeatureData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFeatureData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.loading = false;
          return state;
        }
        toast.success('Feature added successfully!');
        state.loading = false;
      })
      .addCase(addFeatureData.rejected, (state, action) => {
        console.error('Error adding feature data:', action.payload);
      })
      .addCase(updateFeatureData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFeatureData.fulfilled, (state, action) => {
        if (!action.payload) {
          state.loading = false;
          return state;
        }
        toast.success('Feature updated successfully!');
        state.loading = false;
      })
      .addCase(updateFeatureData.rejected, (state, action) => {
        console.error('Error updating feature data:', action.payload);
      });
  },
});
export const { clearFeature, setFeatureResponse, setFeatureUpdateResponse, setFilterForm, setAddForm, clearFilterForm, clearForm } =
  featureSlice.actions;
export default featureSlice.reducer;
