import { ThemeProvider, CssBaseline } from '@mui/material';

import { theme } from '~/theme';

export const AppTheme = ({ children }: AppThemeProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export interface AppThemeProps {
  children?: React.ReactNode | undefined;
}
