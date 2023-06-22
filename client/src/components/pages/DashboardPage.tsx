import { FC, useEffect } from 'react';

import { useGetAccountsQuery } from '../../api/api';
import { useAppDispatch } from '../../app/hooks';
import { setAccountBalance } from '../../features/appSlice';
import { TradingViewWidget } from '../../features/chart/TradingViewWidget';
import { OrderBookWidget } from '../../features/orderBook/OrderBookWidget';
import { RecentTradesWidget } from '../../features/recentTrades/RecentTradesWidget';
import { TradeEntryWidget } from '../../features/tradeEntry/TradeEntryWidget';
import { TradeLogWidget } from '../../features/tradeLog/TradeLogWidget';
import { Navbar } from '../layout/Navbar';
import { TickerTape } from '../layout/TickerTape';

export const DashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const { data: accounts, isLoading, isError } = useGetAccountsQuery({});

  useEffect(() => {
    const accountBalance = accounts?.find((account) => account.currency === 'USDT')?.balance;

    if (accountBalance) {
      dispatch(setAccountBalance(accountBalance));
    }
  }, [accounts]);

  return (
    <div className='flex flex-col h-screen max-h-screen'>
      <Navbar />

      <TickerTape />

      <div className='flex flex-col lg:flex-row mt-2 mb-2 h-full'>
        <div className='w-full lg:w-2/3 flex-grow mr-2'>
          <TradingViewWidget />
        </div>

        <div className='w-full lg:w-1/3 bg-neutral flex space-x-2 widget-container flex-grow overflow-auto'>
          <div className="w-1/2 p-2 flex flex-col h-full">
            <OrderBookWidget />
          </div>

          <div className="overflow-x-auto w-1/2 p-2">
            <RecentTradesWidget />
          </div>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div className='overflow-x-auto w-full lg:w-2/3 bg-neutral flex-grow mr-2 p-2 widget-container h-full'>
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
