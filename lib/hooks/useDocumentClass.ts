import { useEffect } from 'react';

export function useDocumentClass(className: string, condition: boolean): void {
  useEffect(() => {
    if (condition) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  }, [className, condition]);
}
