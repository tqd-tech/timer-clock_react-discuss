import React, { useState, useRef, useEffect } from 'react';

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const milliseconds = String(ms % 1000).padStart(3, '0').slice(0, 2);
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const reset = () => {
    setRunning(false);
    setElapsedTime(0);
  };

  return (
    <>
      <div id="timer" className={running ? 'running' : ''}>
        {formatTime(elapsedTime)}
      </div>
      <div className="btn">
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
}
