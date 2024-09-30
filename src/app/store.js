// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '@/features/category/categorySlice';

export const store = configureStore({
  reducer: {
    category: categoryReducer,
  },
});
