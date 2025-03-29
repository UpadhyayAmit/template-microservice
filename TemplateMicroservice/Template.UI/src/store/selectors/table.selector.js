import { createSelector } from '@reduxjs/toolkit';

const _tableSelector = (state) => state.tableData;

export const tableSelector = createSelector(_tableSelector, (tableData) => tableData);
