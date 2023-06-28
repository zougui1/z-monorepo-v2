import { Outlet } from '@remix-run/react';
import { Provider } from 'react-redux';

import { store } from './store';
import { AppTheme } from './components/AppTheme';

export const App = () => {
  return (
    <AppTheme>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </AppTheme>
  );
}
