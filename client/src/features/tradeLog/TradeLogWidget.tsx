import { FC } from 'react';

export const TradeLogWidget: FC = () => {
  return (
    <>
      <h2 className='ml-2 text-center'>Trade Log</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Status</th>
            <th>Date/Time</th>
            <th>Pair</th>
            <th>Entry Price</th>
            <th>Exit Price</th>
            <th>Entry Quantity</th>
            <th>Position Value</th>
            <th>Margin/Leverage</th>
            <th>Fee</th>
            <th>Profit/Loss %</th>
            <th>Profit/Loss Value</th>
            <th>Risk Reward Ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FILLED</td>
            <td>2023-05-01 13:37</td>
            <td>BTC/USDT</td>
            <td>$1304.12</td>
            <td>1306.13</td>
            <td>32.72</td>
            <td>$4582.4</td>
            <td>100x</td>
            <td>$0.0001</td>
            <td>0.12%</td>
            <td>$5.12</td>
            <td>1:2</td>
          </tr>
          <tr>
            <td>OPEN</td>
            <td>2023-04-31 14:32</td>
            <td>BTC/USDT</td>
            <td>$1308.18</td>
            <td>2138.32</td>
            <td>34.33</td>
            <td>$7123.8</td>
            <td>100x</td>
            <td>$0.0001</td>
            <td>0.22%</td>
            <td>$3.22</td>
            <td>1:3</td>
          </tr>
          <tr>
            <td>CANCELED</td>
            <td>2023-04-31 12:32</td>
            <td>BTC/USDT</td>
            <td>$1303.17</td>
            <td>1138.32</td>
            <td>34.33</td>
            <td>$7123.8</td>
            <td>100x</td>
            <td>$0.0001</td>
            <td>0.22%</td>
            <td>$3.22</td>
            <td>1:3</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
