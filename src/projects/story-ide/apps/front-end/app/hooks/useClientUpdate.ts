import { useState, useEffect } from 'react';

export const useClientUpdate = (): void => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);
}
