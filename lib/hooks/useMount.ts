import { useEffect } from 'react';

export const useMount = (effect: () => void) => {
  useEffect(effect, []);
};
