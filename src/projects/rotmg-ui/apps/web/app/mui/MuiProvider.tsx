import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import createCache from '@emotion/cache';

import { theme } from '~/theme';

function createEmotionCache() {
  return createCache({ key: 'css' });
}

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const cache = createEmotionCache();

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
