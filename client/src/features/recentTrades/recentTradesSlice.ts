import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RecentTradesState {
  trades: {
    side: string;
    price: string;
    size: string;
    time: string;
  }[];
  symbol: string;
}

const initialState: RecentTradesState = {
  trades: [],
  symbol: 'XLM-USDT',
};
export const recentTradesSlice = createSlice({
  name: 'recentTrades',
  initialState: initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setRecentTrades: (
      state,
      action: PayloadAction<{ trades: { side: string; price: string; size: string; time: string; }[]; symbol: string }>
    ) => {
      state.symbol = action.payload.symbol;
      state.trades = action.payload.trades;
    },
    updateRecentTrades: (
      state,
      action: PayloadAction<{ trades: { side: string; price: string; size: string; time: string; }[] }>
    ) => {
      state.trades = state.trades.concat(action.payload.trades);
    }
  }
});

export const {
  setSymbol,
  setRecentTrades,
  updateRecentTrades,
} = recentTradesSlice.actions;
