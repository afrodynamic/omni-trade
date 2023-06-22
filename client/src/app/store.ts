import { Action, AnyAction, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';

import { tradeApi } from '../api/api';
import { appSlice } from '../features/appSlice';
import { orderBookSlice } from '../features/orderBook/orderBookSlice';
import { recentTradesSlice } from '../features/recentTrades/recentTradesSlice';
import { tradeEntrySlice } from '../features/tradeEntry/tradeEntrySlice';

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export const store = configureStore({
  reducer: {
    orderBook: orderBookSlice.reducer,
    recentTrades: recentTradesSlice.reducer,
    [tradeApi.reducerPath]: tradeApi.reducer,
    tradeEntry: tradeEntrySlice.reducer,
    app: appSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tradeApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});
