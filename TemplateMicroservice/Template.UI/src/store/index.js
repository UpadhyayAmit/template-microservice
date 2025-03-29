import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './reducers/auth.js';
import tableReducer from './reducers/table.js';
import toastReducer from './reducers/toast.js';
import popupReducer from './reducers/popup.js';

const rootReducer = combineReducers({
  user: userReducer,
  table: tableReducer,
  toast: toastReducer,
  popup: popupReducer,
});

const store = configureStore({
  reducer: rootReducer,
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //       serializableCheck: false,
  //     }),
});

export default store;
