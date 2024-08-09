import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { reduxStorage } from "./storage";
import rootReducer from "./rootReducer";

const persistConfig = {
    key: "root",
    storage: reduxStorage,
    whitelist: ["game"],
};

const persistReducerData = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistReducerData,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PURGE, PERSIST],
            },
        }),
});

export const persistor = persistStore(store);
