import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import {todosReducer} from '../src/features/todos';
import { metricsReducer } from "../src/features/metrics";

const reducers = combineReducers({todos: todosReducer, metrics: metricsReducer});

export const store = configureStore({
    reducer: reducers,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;