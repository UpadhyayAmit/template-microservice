import { createSelector } from '@reduxjs/toolkit';

const _userSelector = (state) => state.userData;

export const userSelector = createSelector(_userSelector, (userData) => userData);
