import { FC } from 'react';

export const RecentTradesWidget: FC = () => {
  return (
    <>
      <h2 className='ml-2 text-center'>Recent Trades</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Price</th>
            <th>Amount (BTC)</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$837</td>
            <td>1.285</td>
            <td>$8273.49</td>
          </tr>
          <tr>
            <td>$98</td>
            <td>1.448</td>
            <td>$1282.29</td>
          </tr>
          <tr>
            <td>$88</td>
            <td>1.898</td>
            <td>$3229.34</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
