import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { FC, useEffect } from 'react';
import { io } from 'socket.io-client';

import { useGetPartOrderBookQuery } from '../../api/api';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTradeQuantityAndPrice } from '../tradeEntry/tradeEntrySlice';
import { setOrderBook, updateOrderBook } from './orderBookSlice';

export const OrderBookWidget: FC = () => {
  const level = 'level2_20';

  const dispatch = useAppDispatch();

  const symbol = useAppSelector((state) => state.app.symbol);
  const baseCurrency = useAppSelector((state) => state.app.baseCurrency);
  const quoteCurrency = useAppSelector((state) => state.app.quoteCurrency);
  const orderBook = useAppSelector((state) => state.orderBook);


  const { data: orderBookData, isLoading, isError } = useGetPartOrderBookQuery({ symbol, level });

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket.IO connection opened');
    });

    socket.on('orderbook', (data) => {
      dispatch(updateOrderBook(data));
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
    if (orderBookData) {
      dispatch(setOrderBook(orderBookData));
    }
  }, [orderBookData]);

  const handleRowClick = (price: string, quantity: string) => {
    dispatch(setTradeQuantityAndPrice({ price, quantity }));
  };

  return (
    <div className='h-full flex flex-col items-center'>
      <h2 className='text-center'>Orderbook</h2>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: '42vh' }}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Price ({quoteCurrency})</TableCell>
                <TableCell>Amount ({baseCurrency})</TableCell>
                <TableCell>Total ({quoteCurrency})</TableCell>
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
                [...orderBook.asks].reverse().map((ask, index) => (
                  <TableRow key={ask[0]} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'}} onClick={() => handleRowClick(ask[0], ask[1])}>
                    <TableCell sx={{ color: 'red'}}>{ask[0]}</TableCell>
                    <TableCell>{ask[1]}</TableCell>
                    <TableCell>{parseFloat(ask[0]) * parseFloat(ask[1])}</TableCell>
                  </TableRow>
                ))
              )}
              {orderBook?.bids?.map((bid, index) => (
                <TableRow key={bid[0]} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'}} onClick={() => handleRowClick(bid[0], bid[1])}>
                  <TableCell sx={{ color: 'green'}}>{bid[0]}</TableCell>
                  <TableCell>{bid[1]}</TableCell>
                  <TableCell>{parseFloat(bid[0]) * parseFloat(bid[1])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};
