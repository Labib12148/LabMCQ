import { useCallback, useEffect, useRef, useState } from 'react';

const useCountdown = (initialSeconds = 0, onFinish) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return undefined;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          clearInterval(timerRef.current);
          if (onFinish) onFinish();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onFinish]);

  const start = useCallback((seconds) => {
    setRemainingSeconds(seconds);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  return {
    left: remainingSeconds,
    running: isRunning,
    start,
    stop,
  };
};

export default useCountdown;
