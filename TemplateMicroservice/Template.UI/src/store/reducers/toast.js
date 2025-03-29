import { createSlice } from '@reduxjs/toolkit';

const initialToastState = {
  message: undefined,
  open: false,
  type: undefined,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState: initialToastState,
  reducers: {
    AddToastMessage: (state, action) => {
      state.message = action.payload.message;
      state.open = action.payload.open;
      state.type = action.payload.type;
      return state;
    },
    closeToast: (state) => {
      return {
        ...state,
        message: undefined,
        type: state.type,
        open: false,
      };
    },
  },
});

export const { AddToastMessage, closeToast } = toastSlice.actions;
export default toastSlice.reducer;
