import { randomScrambleForEvent } from 'cubing/scramble';
import { useState, useRef, useCallback, useEffect } from 'react';

type TimerReturnType = {time: number, running: boolean, start: () => void, stop: () => void, reset: () => void};

export const useTimer = (): TimerReturnType => {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const animate = useCallback((currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    const elapsedTime = currentTime - startTimeRef.current;
    setTime(elapsedTime);

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (!running) {
      setRunning(true);
      startTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate, running]);

  const stop = useCallback(() => {
		const currentTime = performance.now();
		if (running) {
      setRunning(false);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      // Save the current time when stopping the timer
			const oldStartTime = startTimeRef.current;
      startTimeRef.current = currentTime;

			return currentTime - oldStartTime!;
    }
  }, [running, time]);

  const reset = useCallback(() => {
    setTime(0);
    setRunning(false);
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup function
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return {time, running, start, stop, reset};
};

export const formatTime = (milliseconds: number, precision: number): string => {
  // const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((milliseconds / 1000) / 60);
  const seconds = (milliseconds / 1000) % 60;
	return `${minutes > 0 ? `${minutes}:` : ''}${seconds.toFixed(precision).split('.').map((v, i) => i === 0 ? (minutes === 0 ? v : v.padStart(2, '0')) : v).join('.')}`;
};

type ScrambleReturnType = { nextScramble: () => void, scramble: string | null}

export const useScramble = (event: string): ScrambleReturnType => {
	const [scramble, setScramble] = useState<string | null>(null);
	
	useEffect(() => {
		
		randomScrambleForEvent(event).then(sb => {
			setScramble(sb.toString());
		});
	}, [event]);

	const nextScramble = useCallback(() => {
		randomScrambleForEvent(event).then(sb => {
			setScramble(sb.toString());
		});
	}, [event]);

	return { scramble, nextScramble };
}