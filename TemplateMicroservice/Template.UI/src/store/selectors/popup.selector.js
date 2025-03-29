import { createSelector } from "@reduxjs/toolkit";

const _popupSelector = (state) => state.popupData;

export const popupSelector = createSelector(
  [_popupSelector],
  (popupData) => popupData
);