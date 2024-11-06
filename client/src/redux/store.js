//The store is the central place where the application state is kept.
//The store holds the state tree, allows access to the state via getState(), and allows the state to be updated via dispatch(action).

import { configureStore, combineReducers } from "@reduxjs/toolkit";    //create and configure the Redux store with reducers.
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";                              // used to persist and rehydrate the Redux store state between page reloads.
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/UserSlice";
import snackbarReducer from "./reducers/SnackbarSlice";

const persistConfig = {    //defines settings for redux-persist
  key: "root",             //root key for the persisted state in localStorage
  version: 1,
  storage,
};

const rootReducer = combineReducers({     //Combines multiple reducers into a single root reducer (userReducer and snackbarReducer.)
  user: userReducer,
  snackbar: snackbarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);  // Wraps the rootReducer with persistence functionality, as defined by persistConfig.

export const store = configureStore({   //Initializes the Redux store with the persistedReducer and custom middleware.
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {                    //serializableCheck option is used to define the behavior of the middleware for checking action types.
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],    //ignores actions that are not serializable.   
      },
    }),
});

export const persistor = persistStore(store);  //Creates a persistor object to persist the Redux store state between page reloads.
