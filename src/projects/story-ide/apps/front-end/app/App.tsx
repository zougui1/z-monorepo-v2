import { useEffect, useState } from 'react';
import { Outlet } from '@remix-run/react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider, CssBaseline, Container, CircularProgress } from '@mui/material';

import { store, type Store } from './store';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const App = () => {
  const [localStore, setLocalStore] = useState<Store>(store.store);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLocalStore(store.store);
    });
    store.requestState();

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {!localStore && (
        <Container>
          <CircularProgress />
        </Container>
      )}

      {localStore && (
        <Provider store={localStore}>
          <Outlet />
        </Provider>
      )}

    </ThemeProvider>
  );
}
