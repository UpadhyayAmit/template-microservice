import { createSelector } from '@reduxjs/toolkit';

const _roleSelector = (state) => state.roleData;

export const roleSelector = createSelector(_roleSelector, (roleData) => roleData.rolePrivileges);
