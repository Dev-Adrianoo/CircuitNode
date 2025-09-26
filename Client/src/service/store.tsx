import { configureStore } from "@reduxjs/toolkit";
import { compilerApi } from "./compilerPayload";

export const store = configureStore({
    reducer:{
        [compilerApi.reducerPath]: compilerApi.reducer,

    },
    middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(compilerApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
