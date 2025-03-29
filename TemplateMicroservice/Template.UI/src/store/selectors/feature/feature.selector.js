import { createSelector } from '@reduxjs/toolkit';

const _featureSelector = (state) => state.featureData;
export const featureSelector = createSelector(_featureSelector, (featureData) => featureData);
