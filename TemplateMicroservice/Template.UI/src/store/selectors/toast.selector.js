import { createSelector } from '@reduxjs/toolkit';

const _toastSelector = (state) => state.toastData;
export const toastSelector = createSelector(_toastSelector, (toastData) => toastData);
