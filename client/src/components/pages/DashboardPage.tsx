import { FC } from 'react';
import { TradingViewWidget } from '../../features/chart/TradingViewWidget';
import { OrderBookWidget } from '../../features/orderBook/OrderBookWidget';
import { RecentTradesWidget } from '../../features/recentTrades/RecentTradesWidget';
import { TradeEntryWidget } from '../../features/tradeEntry/TradeEntryWidget';
import { TradeLogWidget } from '../../features/tradeLog/TradeLogWidget';
import { Navbar } from '../layout/Navbar';
import { TickerTape } from '../layout/TickerTape';

export const DashboardPage: FC = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <TickerTape />

      <div className='flex flex-col lg:flex-row flex-grow mt-2 mb-2'>
        <div className='w-full lg:w-2/3 flex-grow mr-2'>
          <TradingViewWidget />
        </div>

        <div className='w-full lg:w-1/3 bg-neutral flex space-x-2 widget-container'>
          <div className="overflow-x-auto w-1/2 p-2">
            <OrderBookWidget />
          </div>

          <div className="overflow-x-auto w-1/2 p-2">
            <RecentTradesWidget />
          </div>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div className='overflow-x-auto w-full lg:w-2/3 bg-neutral flex-grow mr-2 p-2 widget-container'>
          <TradeLogWidget />
        </div>

        <div className='w-full lg:w-1/3 bg-neutral'>
          <div className='flex flex-col h-full p-2 widget-container'>
            <TradeEntryWidget />
          </div>
        </div>
      </div>
    </div>
  );
};
