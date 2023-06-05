import { FC } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { DashboardPage } from '../components/pages/DashboardPage';
import { HomePage } from '../components/pages/HomePage';

export const App: FC = () => {
  return (
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/dashboard'
            element={<DashboardPage />}
          />
        </Routes>
      </Router>
  );
};
