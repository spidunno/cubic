import { useAtom } from 'jotai';
import * as settings from '../global_settings';
import { Box, Skeleton, Typography, useColorScheme } from '@mui/joy';
import ScrambleDisplay from '../components/ScrambleDisplay';
import { formatTime, useScramble, useTimer } from '../util';
import { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { Solve, SolveID } from '../types';
import { nanoid } from 'nanoid';
import Solves from '../components/modules/Solves';

export default function App() {
	// const { mode, setMode } = useColorScheme();
	const [sessions, setSessions] = useAtom(settings.sessions);
	const [session, setSession] = useAtom(settings.session);
	const [ solves, setSolves ] = useAtom(settings.solves);

	const { scramble, nextScramble } = useScramble(sessions[session]?.event || '333');

	const [timer_precision] = useAtom(settings.timer_precision);
	const [timer_delay] = useAtom(settings.timer_delay);

	const { start, stop, running, time } = useTimer();

	const [ready, setReady] = useState(false);
	const [readying, setReadying] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [ finalTime, setFinalTime ] = useState<number | void | null>(null);

	const saveSolve = useCallback((time: number, startingTime?: number) => {
		const solveID: SolveID = nanoid();
		
		const solve: Solve = {
			id: solveID,
			scramble: scramble || "",
			solveTime: finalTime || time,
			startTime: startingTime || startTime || 0
		};

		setSolves({...solves, [solveID]: solve});
		const updatedSessions = {...sessions};
		// @ts-ignore
		if (updatedSessions[session]) {updatedSessions[session].solves.push(solveID)};

		setSessions(updatedSessions);
	}, [startTime, finalTime, scramble]);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback((event) => {
		if (running) {
			event.preventDefault();

			const ft = stop();
			setFinalTime(ft);
			saveSolve(ft!);
			nextScramble();


		}
		else if (event.key === ' ' && !event.repeat) {
			event.preventDefault();
			let canStart = false;
			setReadying(true);
			const timeout = setTimeout(() => {
				setReady(true);
				canStart = true;
			}, timer_delay * 1000);

			const listener = (ev: KeyboardEvent) => {
				if (ev.key === ' ' && !ev.repeat) {
					event.preventDefault();
					setReadying(false);
					if (canStart) {
						const st = Date.now();
						setFinalTime(null);
						start();
						setStartTime(st);
						setReady(false);
						canStart = false;

					} else {
						clearTimeout(timeout);
					}
					document.body.removeEventListener('keyup', listener);
				}
			};
			document.addEventListener('keyup', listener);
		}
	}, [ready, running, start, stop, readying]);

	return (
		<Box sx={{ position: 'relative', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '16px', outline: 'none' }} onKeyDown={handleKeyDown} tabIndex={0}>
			{/* {JSON.stringify(sessions)} */}
			<Box sx={{justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '48px', outline: 'none' }}>
				<Typography level="body-lg" fontFamily={"Roboto Mono"}>{scramble ? scramble : <Skeleton animation="wave">FF F F FF F' FF FF FF F' FF FF FF FF F' F' FF F FF FF F</Skeleton>}</Typography>
				<Typography fontFamily="Roboto Mono" level="title-md" fontSize={"75pt"} color={ready ? 'success' : (readying ? 'danger' : undefined)}>{formatTime(finalTime ? finalTime : time, timer_precision)}</Typography>
				</Box>
			{/* <ScrambleDisplay event={sessions[session]?.event} scramble={scramble ? scramble : undefined}/> */}
			<Box sx={{justifyContent: 'center', alignItems: 'center', gap: '14px', display: 'flex', flexDirection: 'row', width: '100%', height: '300px', outline: 'none' }}>
				<Box sx={{width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden'}}><Solves/></Box>
				<Box sx={{width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden'}}><Solves/></Box>
				<Box sx={{width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden'}}><Solves/></Box>
			</Box>
		</Box>
	)
}
