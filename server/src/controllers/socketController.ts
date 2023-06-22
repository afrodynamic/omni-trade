import API from 'kucoin-node-sdk';
import { Server } from 'socket.io';

interface OrderbookMessage {
  type: string;
  topic: string;
  subject: string;
  data: {
    changes: {
      asks: [string, string][];
      bids: [string, string][];
    },
    sequenceEnd: number;
    sequenceStart: number;
    symbol: string;
    time: number;
  };
}

interface TradeMatchMessage {
  type: string;
  topic: string;
  subject: string;
  data: {
    makerOrderId: string;
    takerOrderId: string;
    price: string;
    sequence: number;
    side: string;
    size: string;
    symbol: string;
    time: number;
    tradeId: string;
    type: string;
  };
}

export const setupSockets = (io: Server) => {
  API.init({
    baseUrl: 'https://api.kucoin.com',
    apiAuth: {
      key: process.env.KUCOIN_API_KEY || '',
      secret: process.env.KUCOIN_API_SECRET || '',
      passphrase: process.env.KUCOIN_API_PASSPHRASE || '',
    }
  });

  const datafeed = new API.websocket.Datafeed();

  const privateDatafeed = new API.websocket.Datafeed(true);

  const connectSockets = async() => {
    await datafeed.connectSocket();
    await privateDatafeed.connectSocket();
  };

  connectSockets();

  datafeed.onClose(() => {
    console.log('ws closed, status ', datafeed.trustConnected);
  });

  privateDatafeed.onClose(() => {
    console.log('ws closed, status ', privateDatafeed.trustConnected);
  });

  const orderbookTopic = '/market/level2:XLM-USDT';
  const orderbookCallbackId = datafeed.subscribe(orderbookTopic, (message: OrderbookMessage) => {
    if (message.topic === orderbookTopic) {
      io.emit('orderbook', message.data);
    }
  });

  const tradeMatchesTopic = '/market/match:XLM-USDT';
  const tradeMatchesCallbackId = datafeed.subscribe(tradeMatchesTopic, (message: TradeMatchMessage) => {
    if (message.topic === tradeMatchesTopic) {
      io.emit('match', message.data);
    }
  });

  const spotTradeOrdersTopic = '/spotMarket/tradeOrdersV2';
  const spotTradeOrdersCallbackId = privateDatafeed.subscribe(spotTradeOrdersTopic, (message: any) => {
    if (message.topic === spotTradeOrdersTopic) {
      console.log(message.data);
      io.emit('orderChange', message.data);
    }
  }, true);

  const unsubscribeConnections = () => {
    console.log('Closing connections...');

    datafeed.unsubscribe(orderbookTopic, orderbookCallbackId);
    datafeed.unsubscribe(tradeMatchesTopic, tradeMatchesCallbackId);
    privateDatafeed.unsubscribe(spotTradeOrdersTopic, spotTradeOrdersCallbackId);
  };

  return unsubscribeConnections;
};
