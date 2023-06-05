import { useState } from 'react';

export const TradeEntryWidget = () => {
  const [tradeType, setTradeType] = useState('limit');
  const [orderType, setOrderType] = useState('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [balance, setBalance] = useState(1000);
  const [volumeTotal, setVolumeTotal] = useState(0);

  const handleTradeTypeChange = (event) => {
    setTradeType(event.target.value);
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
    calculateVolumeTotal(event.target.value, quantity);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    calculateVolumeTotal(price, event.target.value);
  };

  const calculateVolumeTotal = (price, quantity) => {
    const total = parseFloat(price) * parseFloat(quantity);
    setVolumeTotal(total);
  };

  const handleQuickButton = (percentage) => {
    const amount = (balance * percentage) / 100;
    setQuantity(amount.toFixed(2));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Submitting ${orderType} ${tradeType} trade with price: ${price}, quantity: ${quantity}`);
  };

  return (
    <div>
      <h2 className='text-center'>Trade Execution</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Trade Type:</span>
        </label>
        <select value={tradeType} onChange={handleTradeTypeChange} className="select select-bordered">
          <option value="limit">Limit</option>
          <option value="market">Market</option>
          <option value="stop-limit">Stop Limit</option>
          <option value="stop-market">Stop Market</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Order Type:</span>
        </label>
        <select value={orderType} onChange={handleOrderTypeChange} className="select select-bordered">
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Price:</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">Price</span>
          <input type="text" value={price} onChange={handlePriceChange} className="input input-bordered" />
          <span className="input-group-text">USD</span>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Quantity:</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">Quantity</span>
          <input type="text" value={quantity} onChange={handleQuantityChange} className="input input-bordered" />
          <span className="input-group-text">BTC</span>
        </div>
      </div>

      <div>
        <button type="button" onClick={() => handleQuickButton(25)} className="btn btn-primary">25%</button>
        <button type="button" onClick={() => handleQuickButton(50)} className="btn btn-primary">50%</button>
        <button type="button" onClick={() => handleQuickButton(75)} className="btn btn-primary">75%</button>
        <button type="button" onClick={() => handleQuickButton(100)} className="btn btn-primary">100%</button>
      </div>

      <div>
        Available Balance: {balance}
      </div>

      <div>
        Volume Total: {volumeTotal}
      </div>

      <div>
        <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit Trade</button>
      </div>
    </div>
  );
};
