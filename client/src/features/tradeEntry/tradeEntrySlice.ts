import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { OrderType } from '../types';

interface TradeEntryState {
  buyLimitPrice: string;
  sellLimitPrice: string;
  buyStopPrice: string;
  sellStopPrice: string;
  buyQuantity: string;
  sellQuantity: string;
  orderType: OrderType;
}

const initialState: TradeEntryState = {
  buyLimitPrice: '',
  sellLimitPrice: '',
  buyStopPrice: '',
  sellStopPrice: '',
  buyQuantity: '',
  sellQuantity: '',
  orderType: 'limit'
};
export const tradeEntrySlice = createSlice({
  name: 'tradeEntry',
  initialState: initialState,
  reducers: {
    setBuyLimitPrice: (state, action: PayloadAction<string>) => {
      state.buyLimitPrice = action.payload;
    },

    setSellLimitPrice: (state, action: PayloadAction<string>) => {
      state.sellLimitPrice = action.payload;
    },

    setBuyStopPrice: (state, action: PayloadAction<string>) => {
      state.buyStopPrice = action.payload;
    },

    setSellStopPrice: (state, action: PayloadAction<string>) => {
      state.sellStopPrice = action.payload;
    },

    setBuyQuantity: (state, action: PayloadAction<string>) => {
      state.buyQuantity = action.payload;
    },

    setSellQuantity: (state, action: PayloadAction<string>) => {
      state.sellQuantity = action.payload;
    },

    setTradeQuantityAndPrice: (state, action: PayloadAction<{ quantity: string, price: string; }>) => {
      state.buyQuantity = action.payload.quantity;
      state.sellQuantity = action.payload.quantity;
      state.buyLimitPrice = action.payload.price;
      state.sellLimitPrice = action.payload.price;
    },

    setOrderType: (state, action: PayloadAction<OrderType>) => {
      state.orderType = action.payload;
    }
  }
});

export const {
  setBuyLimitPrice,
  setSellLimitPrice,
  setBuyStopPrice,
  setSellStopPrice,
  setBuyQuantity,
  setSellQuantity,
  setTradeQuantityAndPrice,
  setOrderType,
} = tradeEntrySlice.actions;
