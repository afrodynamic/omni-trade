import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AppState {
  symbol: string;
  baseCurrency: string;
  quoteCurrency: string;
  accountBalance: string;
}

const initialState: AppState = {
  symbol: 'XLM-USDT',
  baseCurrency: 'XLM',
  quoteCurrency: 'USDT',
  accountBalance: '0',
};
export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
      [state.baseCurrency, state.quoteCurrency] = action.payload.split('-');
    },

    setAccountBalance: (state, action: PayloadAction<string>) => {
      state.accountBalance = action.payload;
    }
  }
});

export const {
  setSymbol,
  setAccountBalance,
} = appSlice.actions;
