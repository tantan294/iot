import { configureStore } from '@reduxjs/toolkit';
import SpinnerSlice from '../reducer/SpinnerSlice';

const store = configureStore({
    reducer: {
        spinner: SpinnerSlice,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false });
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;