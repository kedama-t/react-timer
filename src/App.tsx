import { ReactEventHandler, useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import workerInterval from './lib/workerIntervals';
import 'react-circular-progressbar/dist/styles.css';

const App = () => {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [goal, setGoal] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const handleStart = (event) => {
    event.preventDefault();
    setGoal(Number(event.target[0].value));
    setTime({ minutes: 0, seconds: 0 });
    setIsActive(true);
  };
  const handleStop: ReactEventHandler = (event) => {
    event.preventDefault();
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const id = workerInterval.setInterval(() => {
      if (time.seconds === 59) {
        setTime({ minutes: time.minutes + 1, seconds: 0 });
      } else {
        setTime({ minutes: time.minutes, seconds: time.seconds + 1 });
      }
    }, 1000);
    return () => workerInterval.clearInterval(id);
  }, [time, isActive]);

  const { circularStyle, textStyle, bgStyle } = time.minutes < goal
    ? {
      circularStyle: "[&_.CircularProgressbar-path]:stroke-amber-300 [&_.CircularProgressbar-background]:fill-amber-600",
      textStyle: "text-amber-300",
      bgStyle: "bg-amber-300"
    }
    : {
      circularStyle: "[&_.CircularProgressbar-path]:stroke-teal-300 [&_.CircularProgressbar-background]:fill-teal-600",
      textStyle: "text-teal-300",
      bgStyle: "bg-teal-300"
    }

  return (
    <div className="p-4">
      {isActive ? (
        <div className="flex flex-col gap-2 items-center">
        <h2>読書中…</h2>
          <CircularProgressbarWithChildren
            className={circularStyle}
            background
            backgroundPadding={8}
            styles={buildStyles({
              strokeLinecap: "round",
              trailColor: "transparent"
            })}
            value={time.seconds}
            maxValue={60}
          >
            <p className={textStyle}>
              <span className="text-7xl">{time.minutes.toString()}</span>/ {goal} 分
            </p>
          </CircularProgressbarWithChildren>
          <button className={`p-4 rounded-xl ${bgStyle}`} onClick={handleStop}>
            Stop
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2 items-center"
          onSubmit={handleStart}
        >
        <h2>目標時間を設定</h2>
          <CircularProgressbarWithChildren
            value={0}
            maxValue={60}
          >
            <div className="flex flex-row gap-2 items-baseline">
              <input
                className="w-36 h-24 text-right text-7xl"
                type="number"
                name="time"
                id="time"
                defaultValue={goal}
              /><label htmlFor="time">分</label>
            </div>
          </CircularProgressbarWithChildren>
          <button className="p-4 rounded-xl bg-slate-200" type="submit">
            Start
          </button>
        </form>
      )}
    </div>
  );
};

export default App;
