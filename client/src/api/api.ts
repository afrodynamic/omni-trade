import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

interface TradeLogEntry {
  id: number;
  symbol: string;
  opType: string;
  type: string;
  side: string;
  price: string;
  size: string;
  funds: string;
  dealFunds: string;
  dealSize: string;
  fee: string;
  feeCurrency: string;
  stp: string;
  stop: string;
  stopTriggered: boolean;
  stopPrice: string;
  timeInForce: string;
  postOnly: boolean;
  hidden: boolean;
  iceberg: boolean;
  visibleSize: string;
  cancelAfter: number;
  channel: string;
  clientOid: string;
  remark: string;
  tags: string;
  isActive: boolean;
  cancelExist: boolean;
  createdAt: number;
  tradeType: string;
}

interface RequestHeaders {
  'Content-Type': string;
  'User-Agent': string;
  'KC-API-KEY': string;
  'KC-API-SIGN': string;
  'KC-API-TIMESTAMP': number;
  'KC-API-PASSPHRASE': string;
  'KC-API-KEY-VERSION'?: string;
}

const sign = (text: string, secret: string) => {
  return createHmac('sha256', secret).update(text).digest('base64');
};

const generateHeaders = (method: string, endpoint: string, requestBody = '') => {
  const timestamp = Date.now();
  const signature = sign(timestamp + method.toUpperCase() + endpoint + requestBody, process.env.KUCOIN_API_SECRET || '');
  const headers: RequestHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'KuCoin-Node-SDK/1.0.4',
    'KC-API-KEY': process.env.KUCOIN_API_KEY || '',
    'KC-API-SIGN': signature,
    'KC-API-TIMESTAMP': timestamp,
    'KC-API-PASSPHRASE': process.env.KUCOIN_API_PASSPHRASE || '',
  };

  const authVersion = 2;
  if (authVersion && (authVersion === 2 || authVersion === '2')) {
    headers['KC-API-KEY-VERSION'] = '2';
    headers['KC-API-PASSPHRASE'] = sign(process.env.KUCOIN_API_PASSPHRASE || '', process.env.KUCOIN_API_SECRET || '');
  }

  return headers;
};

export const tradeApi = createApi({
  reducerPath: 'tradeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: [
    'Account',
    'OrderBook',
    'RecentTrades',
    'TradeLog',
    'TradeLogPaginatedList',
  ],
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: () => ({
        url: '/api/v1/accounts',
        headers: generateHeaders('GET', '/api/v1/accounts'),
      }),
      transformResponse: (response: {
        code: string,
        data: {
          available: string,
          balance: string,
          currency: string,
          holds: string,
          id: string,
          type: string,
        }[]
      }) => {
        return response.data.map((account) => ({
          id: account.id,
          currency: account.currency,
          type: account.type,
          balance: account.balance,
          available: account.available,
          holds: account.holds,
        }));
      },
      providesTags: (result, error, arg) => (result ? [...result.map(({ id }) => ({ type: 'Account' as const, id })), { type: 'Account', id: 'LIST' }] : [{ type: 'Account', id: 'LIST' }]),
    }),

    getPartOrderBook: builder.query({
      query: ({ symbol, level }) => `/api/v1/market/orderbook/${level}?symbol=${symbol}`,
      providesTags: (result, error, symbol, level) => [{ type: 'OrderBook', symbol, level }],
      transformResponse: (response: { data: { sequence: number, asks: string[][], bids: string[][]; }; }) => ({
        sequence: response.data.sequence,
        asks: response.data.asks,
        bids: response.data.bids,
      }),
    }),

    getRecentTrades: builder.query({
      query: ( symbol ) => `/api/v1/market/histories?symbol=${symbol}`,
      providesTags: (result, error, symbol) => [{ type: 'RecentTrades', symbol }],
      transformResponse: (response: {
        data: {
          sequence: string,
          price: string,
          size: string,
          side: string,
          time: string
        }[];
      }) => ({
        trades: response.data.map((trade) => ({
          side: trade.side,
          price: trade.price,
          size: trade.size,
          time: trade.time,
        })),
      }),
    }),

    getTradeLog: builder.query<TradeLogEntry[], {
      currentPage?: number,
      pageSize?: number,
      status?: string,
      symbol?: string,
      side?: string,
      type?: string,
      tradeType?: string,
      startAt?: number,
      endAt?: number,
    }>({
      query: ({ currentPage = 1, pageSize = 50, status, symbol, side, type, tradeType, startAt, endAt }) => {
        const params = new URLSearchParams({
          currentPage: currentPage.toString(),
          pageSize: pageSize.toString(),
          ...(status && { status }),
          ...(symbol && { symbol }),
          ...(side && { side }),
          ...(type && { type }),
          ...(tradeType && { tradeType }),
          ...(startAt && { startAt: startAt.toString() }),
          ...(endAt && { endAt: endAt.toString() }),
        });

        const method = 'GET';
        const endpoint = `/api/v1/orders?${params.toString()}`;
        const headers = generateHeaders(method, endpoint);

        return {
          url: endpoint,
          method,
          headers,
        };
      },
      transformResponse: (response: { code: string, data: { items: TradeLogEntry[], currentPage: number, pageSize: number, totalNum: number, totalPage: number; }; }) => {
        return response.data.items;
      },
      providesTags: (result, error, { currentPage, pageSize }) =>
        result ? [{ type: 'TradeLogPaginatedList', currentPage, pageSize }] : [],
    }),

    createNewLimitOrder: builder.mutation<string, {
      side: string,
      symbol: string,
      type?: string,
      remark?: string,
      stp?: string,
      tradeType?: string,
      price: string,
      size: string,
      timeInForce?: string,
      cancelAfter?: number,
      postOnly?: boolean,
      hidden?: boolean,
      iceberg?: boolean,
      visibleSize?: string,
    }>({
      query: ({ side, symbol, type, remark, stp, tradeType, price, size, timeInForce, cancelAfter, postOnly, hidden, iceberg, visibleSize }) => {
        const clientOid = uuidv4();
        const endpoint = '/api/v1/orders';
        const method = 'POST';

        const body = JSON.stringify({
          clientOid,
          side,
          symbol,
          ...(type && { type }),
          ...(remark && { remark }),
          ...(stp && { stp }),
          ...(tradeType && { tradeType }),
          price: price,
          size: size,
          ...(timeInForce && { timeInForce }),
          ...(cancelAfter && { cancelAfter: cancelAfter.toString() }),
          ...(postOnly && { postOnly: postOnly.toString() }),
          ...(hidden && { hidden: hidden.toString() }),
          ...(iceberg && { iceberg: iceberg.toString() }),
          ...(visibleSize && { visibleSize: visibleSize.toString() }),
        });

        const headers = generateHeaders(method, endpoint, body);

        return {
          url: endpoint,
          method,
          headers,
          body,
        };
      },
      transformResponse: (response: { code: string, data: { orderId: string; }; }) => {
        console.log(response);
        return response.data.orderId;
      },
      providesTags: (result, error, { currentPage, pageSize }) =>
        result ? [{ type: 'TradeLogPaginatedList', currentPage, pageSize }] : [],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetPartOrderBookQuery,
  useGetRecentTradesQuery,
  useGetTradeLogQuery,
  useCreateNewLimitOrderMutation
} = tradeApi;
