import { useState, useEffect, useRef } from 'react';

const CountdownTimer = (initialSeconds, onFinish) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(initialSeconds);

    if (initialSeconds <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function to clear the interval
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initialSeconds, onFinish]); // Dependency array is correct

  return timeLeft;
};

export default CountdownTimer;