import { FC } from 'react';

export const OrderBookWidget: FC = () => {
  return (
    <>
      <h2 className='text-center'>Orderbook</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Price (USDT)</th>
            <th>Amount (BTC)</th>
            <th>Total (BTC)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$132</td>
            <td>7.345</td>
            <td>$4082.29</td>
          </tr>
          <tr>
            <td>$72</td>
            <td>3.345</td>
            <td>$9092.29</td>
          </tr>
          <tr>
            <td>$89</td>
            <td>2.218</td>
            <td>$1279.29</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
