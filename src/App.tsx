import { ReactEventHandler, useEffect, useState } from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import workerInterval from './lib/workerIntervals';
import 'react-circular-progressbar/dist/styles.css';

const App = () => {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const handleStart = (event) => {
    event.preventDefault();
    setTime({ minutes: Number(event.target[0].value), seconds: 0 });
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
      if (time.seconds === 0) {
        if (time.minutes === 0) {
          setIsActive(false);
        } else {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
        }
      } else {
        setTime({ minutes: time.minutes, seconds: time.seconds - 1 });
      }
    }, 1000);
    return () => workerInterval.clearInterval(id);
  }, [time, isActive]);

  return (
    <>
      {isActive ? (
        <div className="flex flex-col gap-2 items-center">
          <CircularProgressbarWithChildren
            value={time.seconds}
            maxValue={60}
          >
            <p>
              <span className="text-8xl">{time.minutes.toString()}</span>min
            </p>
          </CircularProgressbarWithChildren>
          <button className="bg-slate-200" onClick={handleStop}>
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
              defaultValue={90}
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
