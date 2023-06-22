import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface OrderBookState {
  symbol: string;
  sequence: number;
  asks: string[][];
  bids: string[][];
}

const initialState: OrderBookState = {
  symbol: 'XLM-USDT',
  sequence: 0,
  asks: [],
  bids: [],
};
export const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState: initialState,
  reducers: {
    setSymbol: (state, action: PayloadAction<string>) => {
      state.symbol = action.payload;
    },
    setOrderBook: (
      state,
      action: PayloadAction<{
        sequence: number;
        asks: string[][];
        bids: string[][];
      }>
    ) => {
      state.sequence = action.payload.sequence;
      state.asks = action.payload.asks;
      state.bids = action.payload.bids;
    },
    updateOrderBook: (
      state,
      action: PayloadAction<{
        changes: {
          asks: string[][];
          bids: string[][];
        };
        sequenceEnd: number;
        sequenceStart: number;
      }>
    ) => {
      const { changes, sequenceEnd, sequenceStart } = action.payload;

      if (sequenceStart <= state.sequence + 1 && sequenceEnd > state.sequence) {
        const updatedAsks = [...state.asks];

        const updatedBids = [...state.bids];

        for (const [price, size, sequence] of changes.asks) {
          if (price === '0') {
            state.sequence = Math.max(state.sequence, parseInt(sequence));
            continue;
          }

          const index = updatedAsks.findIndex((ask) => ask[0] === price);

          if (size === '0') {
            if (index !== -1) {
              updatedAsks.splice(index, 1);
            }
          } else {
            if (index !== -1) {
              updatedAsks[index] = [price, size, sequence];
            } else {
              updatedAsks.push([price, size, sequence]);
            }
          }

          updatedAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
        }

        for (const [price, size, sequence] of changes.bids) {
          if (price === '0') {
            state.sequence = Math.max(state.sequence, parseInt(sequence));
            continue;
          }

          const index = updatedBids.findIndex((bid) => bid[0] === price);

          if (size === '0') {
            if (index !== -1) {
              updatedBids.splice(index, 1);
            }
          } else {
            if (index !== -1) {
              updatedBids[index] = [price, size, sequence];
            } else {
              updatedBids.push([price, size, sequence]);
            }
          }

          updatedBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
        }

        state.sequence = sequenceEnd;
        state.asks = updatedAsks;
        state.bids = updatedBids;
      }
    }
  }
});

export const {
  setSymbol,
  setOrderBook,
  updateOrderBook
} = orderBookSlice.actions;
