import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, ButtonGroup, FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, Tab } from '@mui/material';
import axios from 'axios';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { useCreateNewLimitOrderMutation, useGetAccountsQuery } from '../../api/api';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { OrderType } from '../types';
import { setBuyLimitPrice, setBuyQuantity, setBuyStopPrice, setSellLimitPrice, setSellQuantity, setSellStopPrice } from './tradeEntrySlice';

export const TradeEntryWidget = () => {
  const dispatch = useAppDispatch();

  const symbol = useAppSelector((state) => state.app.symbol);
  const baseCurrency = useAppSelector((state) => state.app.baseCurrency);
  const quoteCurrency = useAppSelector((state) => state.app.quoteCurrency);
  const accountBalance = useAppSelector((state) => state.app.accountBalance);

  const buyLimitPrice = useAppSelector((state) => state.tradeEntry.buyLimitPrice);
  const sellLimitPrice = useAppSelector((state) => state.tradeEntry.sellLimitPrice);
  const buyStopPrice = useAppSelector((state) => state.tradeEntry.buyStopPrice);
  const sellStopPrice = useAppSelector((state) => state.tradeEntry.sellStopPrice);
  const buyQuantity = useAppSelector((state) => state.tradeEntry.buyQuantity);
  const sellQuantity = useAppSelector((state) => state.tradeEntry.sellQuantity);
  const orderType = useAppSelector((state) => state.tradeEntry.orderType);

  const { data: accounts, isLoading, isError } = useGetAccountsQuery({});
  const [createNewLimitOrder, { data: newLimitOrderId, isLoading: isCreatingNewLimitOrder }] = useCreateNewLimitOrderMutation({});

  const [selectedTab, setSelectedTab] = useState<OrderType>('limit');
  const [selectedSymbolBalance, setSelectedSymbolBalance] = useState('');
  const [buyVolumeTotal, setBuyVolumeTotal] = useState(0);
  const [sellVolumeTotal, setSellVolumeTotal] = useState(0);
  const [buyStopLimitPriceInputIsFocused, setBuyStopLimitPriceInputIsFocused] = useState(false);
  const [sellStopLimitPriceInputIsFocused, setSellStopLimitPriceInputIsFocused] = useState(false);
  const [buyLimitPriceInputIsFocused, setBuyLimitPriceInputIsFocused] = useState(false);
  const [sellLimitPriceInputIsFocused, setSellLimitPriceInputIsFocused] = useState(false);

  useEffect(() => {
    const account = accounts?.find((account) => account.currency === baseCurrency);
    setSelectedSymbolBalance(account?.balance || '0');
  }, [accounts, baseCurrency]);

  useEffect(() => {
    calculateBuyVolumeTotal(buyLimitPrice, buyQuantity);
  }, [buyLimitPrice, buyQuantity]);

  useEffect(() => {
    calculateSellVolumeTotal(sellLimitPrice, sellQuantity);
  }, [sellLimitPrice, sellQuantity]);

  const handleBuyLimitPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBuyLimitPrice(event.target.value));
    calculateBuyVolumeTotal(event.target.value, buyQuantity);
  };

  const handleSellLimitPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSellLimitPrice(event.target.value));
    calculateSellVolumeTotal(event.target.value, sellQuantity);
  };

  const handleBuyStopPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBuyStopPrice(event.target.value));
  };

  const handleSellStopPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSellStopPrice(event.target.value));
  };

  const handleBuyQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setBuyQuantity(event.target.value));
    calculateBuyVolumeTotal(buyLimitPrice, event.target.value);
  };

  const handleSellQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSellQuantity(event.target.value));
    calculateSellVolumeTotal(sellLimitPrice, event.target.value);
  };

  const calculateBuyVolumeTotal = (price: string, quantity: string) => {
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      setBuyVolumeTotal(0);
    } else {
      const total = parsedPrice * parsedQuantity;
      setBuyVolumeTotal(total);
    }
  };

  const calculateSellVolumeTotal = (price: string, quantity: string) => {
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      setBuyVolumeTotal(0);
    } else {
      const total = parsedPrice * parsedQuantity;
      setSellVolumeTotal(total);
    }
  };

  const handleQuickBuyButton = (percentage: number) => {
    const amount = (parseFloat(selectedSymbolBalance) * percentage) / 100;
    dispatch(setBuyQuantity(amount.toFixed(2)));
    setBuyVolumeTotal(parseFloat(buyLimitPrice) * amount);
  };

  const handleQuickSellButton = (percentage: number) => {
    const amount = (parseFloat(accountBalance) * percentage) / 100;
    dispatch(setSellQuantity(amount.toFixed(2)));
  };

  const handleTabChange = (event: SyntheticEvent, newValue: OrderType) => {
    setSelectedTab(newValue);
  };

  const handleBuyButton = async() => {
    const result = await createNewLimitOrder({
      side: 'buy',
      symbol: symbol,
      type: 'limit',
      price: buyLimitPrice,
      size: buyQuantity,
    });

    if ('data' in result) {
      const orderId = result.data;
      toast.success('Order created successfully');
      await axios.post('http://localhost:3000/api/orders', { 'orderId': orderId });
    } else {
      const error = result.error;
      console.error('Error creating order:', error);
    }
  };

  const handleSellButton = async() => {
    await createNewLimitOrder({
      side: 'sell',
      symbol: symbol,
      type: 'limit',
      price: sellLimitPrice,
      size: sellQuantity,
    });
  };

  const handleBuyFocus = (inputName: string) => {
    if (inputName === 'limit') {
      setBuyLimitPriceInputIsFocused(true);
    } else if (inputName === 'stop') {
      setBuyStopLimitPriceInputIsFocused(true);
    }
  };

  const handleSellFocus = (inputName: string) => {
    if (inputName === 'limit') {
      setSellLimitPriceInputIsFocused(true);
    } else if (inputName === 'stop') {
      setSellStopLimitPriceInputIsFocused(true);
    }
  };

  const handleBuyBlur = (inputName: string) => {
    if (inputName === 'limit') {
      setBuyLimitPriceInputIsFocused(false);
    } else if (inputName === 'stop') {
      setBuyStopLimitPriceInputIsFocused(false);
    }
  };

  const handleSellBlur = (inputName: string) => {
    if (inputName === 'limit') {
      setSellLimitPriceInputIsFocused(false);
    } else if (inputName === 'stop') {
      setSellStopLimitPriceInputIsFocused(false);
    }
  };

  const renderFormControls = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid item>
            {(selectedTab === 'stopLimit' || selectedTab === 'stopMarket') ? (
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-buy-stop-price">Stop Price</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-price-buy-stop-price"
                  startAdornment={(buyStopLimitPriceInputIsFocused || buyStopPrice) && <InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{quoteCurrency}</InputAdornment>}
                  label="Stop Price"
                  value={buyStopPrice}
                  onChange={handleBuyStopPriceChange}
                  onFocus={() => handleBuyFocus('stop')}
                  onBlur={() => handleBuyBlur('stop')}
                />
              </FormControl>
            ) : (
              <FormControl fullWidth sx={{ m: 1, visibility: 'hidden' }}>
                <InputLabel htmlFor="buy-invisible-input"></InputLabel>
                <OutlinedInput
                  id="buy-invisible-input"
                />
              </FormControl>
            )}

            {selectedTab === 'limit' || selectedTab === 'stopLimit' ? (
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-buy-limit-price">Limit Price</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-buy-limit-price"
                  startAdornment={(buyLimitPriceInputIsFocused || buyLimitPrice) && <InputAdornment position="start">$</InputAdornment>}
                  endAdornment={<InputAdornment position="end">{quoteCurrency}</InputAdornment>}
                  label="Limit Price"
                  value={buyLimitPrice}
                  onChange={handleBuyLimitPriceChange}
                  onFocus={() => handleBuyFocus('limit')}
                  onBlur={() => handleBuyBlur('limit')}
                />
              </FormControl>
            ) : (
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-buy-market-price">Market Price</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-buy-market-price"
                  label="Market Price"
                  defaultValue="Best Market Price"
                  sx={{ fontWeight: 'bold' }}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </FormControl>
            )}

            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-buy-quantity">Quantity</InputLabel>
              <OutlinedInput
                id="outlined-adornment-buy-quantity"
                endAdornment={<InputAdornment position="end">{baseCurrency}</InputAdornment>}
                label="Quantity"
                value={buyQuantity}
                onChange={handleBuyQuantityChange}
              />
            </FormControl>
            <FormControl fullWidth sx={{ m: 1 }}>
              <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
                <Button size="small" color="success" onClick={() => handleQuickBuyButton(25)}>25%</Button>
                <Button size="small" color="success" onClick={() => handleQuickBuyButton(50)}>50%</Button>
                <Button size="small" color="success" onClick={() => handleQuickBuyButton(75)}>75%</Button>
                <Button size="small" color="success" onClick={() => handleQuickBuyButton(100)}>100%</Button>
              </ButtonGroup>
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-buy-base-balance">Base Balance</InputLabel>
              <OutlinedInput
                id="outlined-adornment-buy-base-balance"
                endAdornment={<InputAdornment position="end">{baseCurrency}</InputAdornment>}
                label="Base Balance"
                value={selectedSymbolBalance}
                readOnly
              />
            </FormControl>

            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-buy-total">Total</InputLabel>
              <OutlinedInput
                id="outlined-adornment-buy-total"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Total"
                value={buyVolumeTotal}
                readOnly
              />
            </FormControl>

            <FormControl fullWidth sx={{ m: 1}}>
              <Button color="success" variant="contained" onClick={handleBuyButton}>Buy</Button>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          {(selectedTab === 'stopLimit' || selectedTab === 'stopMarket') ? (
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-sell-stop-price">Stop Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-sell-stop-price"
                startAdornment={(sellStopLimitPriceInputIsFocused || sellStopPrice) && <InputAdornment position="start">$</InputAdornment>}
                endAdornment={<InputAdornment position="end">{quoteCurrency}</InputAdornment>}
                label="Stop Price"
                value={sellStopPrice}
                onChange={handleSellStopPriceChange}
                onFocus={() => handleSellFocus('stop')}
                onBlur={() => handleSellBlur('stop')}
              />
            </FormControl>
          ) : (
            <FormControl fullWidth sx={{ m: 1, visibility: 'hidden' }}>
              <InputLabel htmlFor="sell-invisible-input"></InputLabel>
              <OutlinedInput
                id="sell-invisible-input"
              />
            </FormControl>
          )}

          {selectedTab === 'limit' || selectedTab === 'stopLimit' ? (
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-sell-limit-price">Limit Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-sell-limit-price"
                startAdornment={(sellLimitPriceInputIsFocused || sellLimitPrice) && <InputAdornment position="start">$</InputAdornment>}
                endAdornment={<InputAdornment position="end">{quoteCurrency}</InputAdornment>}
                label="Limit Price"
                value={sellLimitPrice}
                onChange={handleSellLimitPriceChange}
                onFocus={() => handleSellFocus('limit')}
                onBlur={() => handleSellBlur('limit')}
              />
            </FormControl>
          ) : (
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-sell-market-price">Market Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-sell-market-price"
                label="Market Price"
                defaultValue="Best Market Price"
                sx={{ fontWeight: 'bold' }}
                inputProps={{
                  readOnly: true
                }}
              />
            </FormControl>
          )}

          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-sell-quantity">Quantity</InputLabel>
            <OutlinedInput
              id="outlined-adornment-sell-quantity"
              endAdornment={<InputAdornment position="end">{baseCurrency}</InputAdornment>}
              label="Quantity"
              value={sellQuantity}
              onChange={handleSellQuantityChange}
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
            <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
              <Button size="small" color="error" onClick={() => handleQuickSellButton(25)}>25%</Button>
              <Button size="small" color="error" onClick={() => handleQuickSellButton(50)}>50%</Button>
              <Button size="small" color="error" onClick={() => handleQuickSellButton(75)}>75%</Button>
              <Button size="small" color="error" onClick={() => handleQuickSellButton(100)}>100%</Button>
            </ButtonGroup>
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-sell-quote-balance">Quote Balance</InputLabel>
            <OutlinedInput
              id="outlined-adornment-sell-quote-balance"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              endAdornment={<InputAdornment position="end">{quoteCurrency}</InputAdornment>}
              label="Quote Balance"
              value={accountBalance}
              readOnly
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-sell-total">Total</InputLabel>
            <OutlinedInput
              id="outlined-adornment-sell-total"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Total"
              value={sellVolumeTotal}
              readOnly
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }}>
            <Button color="error" variant="contained" onClick={handleSellButton}>Sell</Button>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: '100%', typography: 'body1', display: 'flex', flexDirection: 'column' }}>
        <TabContext value={selectedTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              <Tab label="Limit" value="limit" />
              <Tab label="Market" value="market" />
              <Tab label="Stop Limit" value="stopLimit" />
              <Tab label="Stop Market" value="stopMarket" />
            </TabList>
          </Box>
          <Box>
            <TabPanel value="limit">
              {renderFormControls()}
            </TabPanel>
            <TabPanel value="market">
              {renderFormControls()}
            </TabPanel>
            <TabPanel value="stopLimit">
              {renderFormControls()}
            </TabPanel>
            <TabPanel value="stopMarket">
              {renderFormControls()}
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </div>
  );
};
