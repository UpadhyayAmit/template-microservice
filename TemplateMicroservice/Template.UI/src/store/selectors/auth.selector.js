import { createSelector } from '@reduxjs/toolkit';

const _getAuthData = (state) => state.authData;

export const getRolePrivileges = createSelector([_getAuthData], (authData) => authData.rolePrivileges);

export const getAuthData = createSelector([_getAuthData], (authData) => authData);
