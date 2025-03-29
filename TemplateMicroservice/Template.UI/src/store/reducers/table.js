import { createSlice } from '@reduxjs/toolkit';

const initialTableState = {
  pageIndex: 0,
  pageSize: 10,
};

const tableSlice = createSlice({
  name: 'table',
  initialState: initialTableState,
  reducers: {
    setPageIndex: (state, action) => {
      state.pageIndex = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
});

export const { setPageIndex, setPageSize } = tableSlice.actions;
export default tableSlice.reducer;
