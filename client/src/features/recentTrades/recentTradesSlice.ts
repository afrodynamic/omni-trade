import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RecentTradesState {
  trades: {
    side: string;
    price: string;
    size: string;
    time: string;
  }[];
  symbol: string;
  currentPrice: string;
  lastTradeSide: string;
}

const initialState: RecentTradesState = {
  trades: [],
  symbol: 'XLM-USDT',
  currentPrice: '0',
  lastTradeSide: ''
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

      if (action.payload.trades.length > 0) {
        state.currentPrice = action.payload.trades[action.payload.trades.length - 1].price;
        state.lastTradeSide = action.payload.trades[action.payload.trades.length - 1].side;
      }
    },

    updateRecentTrades: (
      state,
      action: PayloadAction<{ side: string; price: string; size: string; time: string; }>
    ) => {
      state.trades = state.trades.concat(action.payload);
      state.currentPrice = action.payload.price;
      state.lastTradeSide = action.payload.side;
    }
  }
});

export const {
  setSymbol,
  setRecentTrades,
  updateRecentTrades,
} = recentTradesSlice.actions;
