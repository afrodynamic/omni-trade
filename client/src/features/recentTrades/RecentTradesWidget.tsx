import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FC, useEffect } from 'react';
import { io } from 'socket.io-client';

import { useGetRecentTradesQuery } from '../../api/api';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTradeQuantityAndPrice } from '../tradeEntry/tradeEntrySlice';
import { setRecentTrades, updateRecentTrades } from './recentTradesSlice';

export const RecentTradesWidget: FC = () => {
  const symbol = useAppSelector((state) => state.app.symbol);
  const baseCurrency = useAppSelector((state) => state.app.baseCurrency);
  const quoteCurrency = useAppSelector((state) => state.app.quoteCurrency);

  const { data: recentTradesData, isLoading, isError } = useGetRecentTradesQuery(symbol);

  const dispatch = useAppDispatch();

  const recentTrades = useAppSelector((state) => state.recentTrades);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket.IO connection opened');
    });

    socket.on('match', (data) => {
      dispatch(updateRecentTrades(data));
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (recentTradesData) {
      dispatch(setRecentTrades({ symbol, ...recentTradesData }));
    }
  }, [recentTradesData]);

  const formatNanosecondTime = (timeString: string, trade: any) => {
    const date = new Date(Number(timeString) / 1000000);

    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    if (time === 'Invalid Date') {
      console.log('ERROR: ' + timeString, '\n', trade);
    }
    return time;
  };

  const handleRowClick = (price: string, quantity: string) => {
    dispatch(setTradeQuantityAndPrice({ price, quantity }));
  };

  return (
    <>
      <h2 className='ml-2 text-center'>Recent Trades</h2>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '42vh' }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Price ({quoteCurrency})</TableCell>
                <TableCell>Amount ({baseCurrency})</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={3}>Error fetching data</TableCell>
                </TableRow>
              ) : (
                recentTrades?.trades.length > 0 && [...recentTrades.trades].reverse().map((trade, index) =>
                  trade && (
                    <TableRow key={`${index}-${trade?.time}`} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'}} onClick={() => handleRowClick(trade.price, trade.size)}>
                      <TableCell sx={{ color: trade?.side === 'buy' ? 'green' : 'red'}}>{trade?.price}</TableCell>
                      <TableCell>{trade?.size}</TableCell>
                      <TableCell>{formatNanosecondTime(trade?.time, trade)}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
