import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  confirmPopup: {
    title: '',
    openConfirmPopup: false,
  },
  formPopup: {
    title: '',
    openFormPopup: false,
    editMode: false,
  },
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    openConfirmPopup: (state, action) => {
      state.confirmPopup.openConfirmPopup = action.payload.openConfirmPopup;
      state.confirmPopup.title = action.payload.title;
    },
    closeConfirmPopup: (state) => {
      state.confirmPopup.openConfirmPopup = false;
    },
    setTitle: (state, action) => {
      state.confirmPopup.title = action.payload.title;
    },
    openFormPopup: (state, action) => {
      state.formPopup.openFormPopup = action.payload.openFormPopup;
      state.formPopup.title = action.payload.title;
      state.formPopup.editMode = action.payload.editMode;
    },
    closeFormPopup: (state) => {
      state.formPopup.openFormPopup = false;
    },
    setEditMode: (state, action) => {
      state.formPopup.editMode = action.payload.editMode;
    },
  },
});

export const { openConfirmPopup, closeConfirmPopup, setTitle, openFormPopup, closeFormPopup, setEditMode } = popupSlice.actions;

export default popupSlice.reducer;
