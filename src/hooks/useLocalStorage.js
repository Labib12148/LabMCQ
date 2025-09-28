import { useEffect, useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      /* ignore storage write errors */
    }
  }, [key, storedValue]);

  const setValue = (value) => {
    setStoredValue((current) => {
      const nextValue = value instanceof Function ? value(current) : value;
      return nextValue;
    });
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
