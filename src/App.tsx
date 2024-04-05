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

  return (
    <>
      {isActive ? (
        <div className="flex flex-col gap-2 items-center">
          <CircularProgressbarWithChildren
          className="[&_.CircularProgressbar-path]:stroke-amber-300 [&_.CircularProgressbar-background]:fill-amber-600"
            background
            backgroundPadding={8}
            styles={buildStyles({
              strokeLinecap: "round",
              trailColor: "transparent"
            })}
            value={time.seconds}
            maxValue={60}
          >
            <p className="text-amber-300">
              <span className="text-8xl">{time.minutes.toString()}</span>/ {goal} 分
            </p>
          </CircularProgressbarWithChildren>
          <button className="bg-amber-300" onClick={handleStop}>
            Stop
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-2 items-center"
          onSubmit={handleStart}
        >

          <CircularProgressbarWithChildren
            value={0}
            maxValue={60}
          >
            <input
              className="w-40 h-40 text-center text-8xl inline-block"
              type="number"
              name="time"
              defaultValue={goal}
            />
          </CircularProgressbarWithChildren>
          <button className="bg-slate-200" type="submit">
            Start
          </button>
        </form>
      )}
    </>
  );
};

export default App;
