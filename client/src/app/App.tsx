import { FC } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import { DashboardPage } from '../components/pages/DashboardPage';
import { HomePage } from '../components/pages/HomePage';
import { store } from './store';

export const App: FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            path='/dashboard'
            element={<DashboardPage />}
          />
        </Routes>
      </Router>

      <ToastContainer theme='dark' />
    </Provider>
  );
};
