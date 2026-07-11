import { useEffect, useRef } from 'react';

export const useMount = (effect: () => void) => {
  const effectRef = useRef(effect);
  useEffect(() => effectRef.current(), []);
};
