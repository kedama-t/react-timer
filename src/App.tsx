import { ReactEventHandler, useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
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
    const timer = setInterval(() => {
      console.log(time);
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
    return () => clearInterval(timer);
  }, [time, isActive]);

  return (
    <>
      {isActive ? (
        <>
          <CircularProgressbar
            className="w-48 h-48"
            value={time.seconds}
            maxValue={60}
            text={time.minutes.toString()}
          />
          <button className="bg-slate-200" onClick={handleStop}>
            Stop
          </button>
        </>
      ) : (
        <form
          className="flex flex-col gap-2 items-center"
          onSubmit={handleStart}
        >
          <input
            className="w-48 h-48 text-9xl"
            type="number"
            name="time"
            defaultValue={90}
          />
          <button className="bg-slate-200" type="submit">
            Start
          </button>
        </form>
      )}
    </>
  );
};

export default App;
