import { useEffect, useRef, useState } from "react";

const useCountDown = (total, ms = 1000) => {
  const [counter, setCountDown] = useState(total);
  const [startCountDown, setStartCountDown] = useState(false);
  // Store the created interval
  const intervalId = useRef();
  const start = () => setStartCountDown(true);
  const pause = () => setStartCountDown(false);
  const reset = () => {
    clearInterval(intervalId.current);
    setStartCountDown(false);
    setCountDown(total);
  };

  useEffect(() => {
    intervalId.current = setInterval(() => {
      startCountDown && counter > 0 && setCountDown((counter) => counter - 1);
    }, ms);
    // Clear interval when count to zero
    if (counter === 0) clearInterval(intervalId.current);
    // Clear interval when unmount
    return () => clearInterval(intervalId.current);
  }, [startCountDown, counter, ms]);

  return [counter, start, pause, reset];
};
export default useCountDown;
