import { div } from "framer-motion/client";
import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [laps, setLaps] = useState([]);
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
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const milliseconds = String(ms % 1000)
      .padStart(3, "0")
      .slice(0, 2);
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  const reset = () => {
    setRunning(false);
    setElapsedTime(0);
    setHasStarted(false);
    setLaps([]);
  };

  const handleLap = () => {
    const newLap = {
      time: elapsedTime, // lưu dạng số
      timestamp: Date.now(),
    };
    setLaps([...laps, newLap]);
  };

  const exportLog = () => {
    if (laps.length === 0) {
      alert("No laps to export.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    laps.forEach((lap, index) => {
      const row = `${index + 1},${formatTime(lap.time)},${new Date(
        lap.timestamp
      ).toLocaleString()}`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stopwatch_logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteLap = (indexToDelete) => {
    setLaps(laps.filter((_, index) => index !== indexToDelete));
  };

  return (
    <>
      <div id="timer" className={running ? "running" : ""}>
        {formatTime(elapsedTime)}
      </div>
      <div className="btn">
        <button
          onClick={() => {
            setRunning(true);
            setHasStarted(true);
          }}
          style={{ backgroundColor: "white", color: "black" }}
        >
          {hasStarted ? "Resume" : "Start"}
        </button>
        <button
          onClick={() => {
            setRunning(false);
          }} 
          style={{ backgroundColor: "orange" }}
        >
          Stop
        </button>
        <button onClick={reset} style={{ backgroundColor: "red" }}>
          Reset
        </button>
        <button onClick={handleLap} disabled={!running} style={{ backgroundColor: "green" }}>
          Save
        </button>
      </div>
      <div>
        <ul className="laps">
          {laps.map((lap, index) => (
            <div className="lap">
              <span> {index + 1}. </span>
              <li key={index}>{formatTime(lap.time)}</li>
              <button onClick={() => deleteLap(index)} className="delete-btn">
                Xóa
              </button>
            </div>
          ))}
        </ul>

        {laps.length > 0 && (
          <div>
            <h3 style={{ color: "white" }}>Biểu đồ thời gian:</h3>
            <LineChart
              width={500}
              height={300}
              data={laps.map((lap, index) => ({
                lap: index + 1,
                time: lap.time / 1000,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lap" />
              <YAxis
                label={{ value: "Seconds", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="time" stroke="#8884d8" />
            </LineChart>
          </div>
        )}

        {laps.length > 0 && (
          <button onClick={exportLog} className="export-btn">
            Export to Excel
          </button>
        )}
      </div>
    </>
  );
}
