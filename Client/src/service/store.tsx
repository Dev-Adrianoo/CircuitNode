import { configureStore } from "@reduxjs/toolkit";
import { compilerApi } from "./compilerPayload";
import editorReducer from '@/features/editor/editorSlice';

export const store = configureStore({
    reducer:{
        [compilerApi.reducerPath]: compilerApi.reducer,
        editor: editorReducer,
    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(compilerApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
