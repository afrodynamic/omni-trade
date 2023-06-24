import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { toast } from 'react-toastify';

import { useCancelAllOrdersMutation, useCancelOrderByClientOidMutation, useGetTradeLogQuery } from '../../api/api';

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return time;
};

export const TradeLogWidget: FC = () => {
  const { data: tradeLogData, isLoading, isError, refetch: getTradeLog } = useGetTradeLogQuery({});
  const { data: orderHistoryData, refetch: getTradeLogActive } = useGetTradeLogQuery({
    status: 'active'
  });
  const [cancelOrderByClientOrderId, { data: canceledOrderId, isLoading: isCanceling}] = useCancelOrderByClientOidMutation();
  const [cancelAllOrders, { data: canceledAllOrders, isLoading: isCancelingAll}] = useCancelAllOrdersMutation();

  const [selectedTab, setSelectedTab] = useState('openOrders');

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Socket.IO connection opened');
    });

    socket.on('orderChange', (data) => {
      getTradeLog();
      getTradeLogActive();
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

  const handleCancelOrder = async(clientOrderId: string) => {
    const result = await cancelOrderByClientOrderId(clientOrderId);

    if (result.data) {
      toast.success('Order canceled successfully');
    }
  };

  const handleCancelAllOrders = async() => {
    const result = await cancelAllOrders({});

    if (result.data) {
      toast.success('All orders canceled successfully');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', maxHeight: '40vh', overflow: 'hidden' }}>
      <Box sx={{ width: '100%' }}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              <Tab label="Open Orders" value="openOrders" />
              <Tab label="Trade History" value="tradeHistory" />
            </TabList>
          </Box>
          <Box>
            <TabPanel value="openOrders">
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '46vh' }}>
                  <Table stickyHeader aria-label="sticky table" size="small" sx={{ maxHeight: '10vh', overflow: 'auto'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Time</TableCell>
                        <TableCell>Direction</TableCell>
                        <TableCell>Pair</TableCell>
                        <TableCell>Order Price</TableCell>
                        <TableCell>Order Quantity</TableCell>
                        <TableCell>Position Value</TableCell>
                        <TableCell>
                          <Button variant="text" color="error" size="small" disabled={isCanceling} onClick={handleCancelAllOrders}>
                            Cancel All
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7}>Loading...</TableCell>
                        </TableRow>
                      ) : isError ? (
                        <TableRow>
                          <TableCell colSpan={7}>Error fetching data</TableCell>
                        </TableRow>
                      ) : orderHistoryData && orderHistoryData.length < 1 ? (
                        <TableRow>
                          <TableCell colSpan={7}>No trade history</TableCell>
                        </TableRow>
                      ) : (
                        orderHistoryData?.map((trade, index) => (
                          <TableRow key={index} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'}}>
                            <TableCell>{formatTime(trade.createdAt)}</TableCell>
                            <TableCell sx={{ color: trade.side === 'buy' ? 'green' : 'red'}}>{trade.side}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell>{trade.price}</TableCell>
                            <TableCell>{trade.size}</TableCell>
                            <TableCell>${parseFloat(trade.price) * parseFloat(trade.size)}</TableCell>
                            <TableCell onClick={() => handleCancelOrder(trade.clientOid)}>
                              <Button variant="contained" color="error" size="small" disabled={isCanceling}>
                                Cancel
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
            <TabPanel value="tradeHistory">
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: '46vh' }}>
                  <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date/Time</TableCell>
                        <TableCell>Direction</TableCell>
                        <TableCell>Pair</TableCell>
                        <TableCell>Order Price</TableCell>
                        <TableCell>Order Quantity</TableCell>
                        <TableCell>Position Value</TableCell>
                        <TableCell>Fee</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6}>Loading...</TableCell>
                        </TableRow>
                      ) : isError ? (
                        <TableRow>
                          <TableCell colSpan={6}>Error fetching data</TableCell>
                        </TableRow>
                      ) : tradeLogData && tradeLogData?.length < 1 ? (
                        <TableRow>
                          <TableCell colSpan={6}>No trade history</TableCell>
                        </TableRow>
                      ) : (
                        tradeLogData?.map((trade, index) => (
                          <TableRow key={index} sx={{ bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default'}}>
                            <TableCell>{formatTime(trade.createdAt)}</TableCell>
                            <TableCell sx={{ color: trade.side === 'buy' ? 'green' : 'red'}}>{trade.side}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell>{trade.dealFunds}</TableCell>
                            <TableCell>{trade.dealSize}</TableCell>
                            <TableCell>${parseFloat(trade.dealFunds) * parseFloat(trade.dealSize)}</TableCell>
                            <TableCell>{trade.fee}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </div>
  );
};
