import { atom, getDefaultStore, useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as settings from '../global_settings';
import { Box, Button, ButtonGroup, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Option, Select, Sheet, Skeleton, Stack, Typography, useColorScheme } from '@mui/joy';
import ScrambleDisplay from '../components/ScrambleDisplay';
import { formatTime, useScramble, useTimer } from '../util';
import React, { KeyboardEventHandler, useCallback, useEffect, useMemo, useState } from 'react';
import { EventID, Session, Solve, SolveID } from '../types';
import { nanoid } from 'nanoid';
import Solves from '../components/modules/Solves';
import Graph from '../components/modules/Plot';
import { Add } from '@mui/icons-material';
const store = getDefaultStore();

export default function App() {
	// const { mode, setMode } = useColorScheme();
	const [sessionId, setSessionId] = useAtom(settings.session);
	
	/*
	If something went wrong (for example a user cleared their localStorage but not the IndexedDB),
	then the DB won't contain the sessionId as a key and we should set the
	sessionId to the first one in the list just so that no errors occur. */
	if (!store.get(settings.sessions.keys).includes(sessionId)) {
		setSessionId(store.get(settings.sessions.keys)[0]);
	}

	// Stupid but it's just so that typescript knows that session will never be undefined here.
	const [session, setSession] = useAtom(useMemo(() => 
																											atom((get) => get(settings.sessions.item(get(settings.session))) as Session,
																											(_get, set, newSession: Session) => {
																												set(settings.sessions.item(_get(settings.session)), newSession)
																											}), []));
	const setSolve = useSetAtom(settings.solves.set);

	const { scramble, nextScramble } = useScramble(session.event || '333');

	const [timer_precision] = useAtom(settings.timer_precision);
	const [timer_delay] = useAtom(settings.timer_delay);

	const { start, stop, running, time } = useTimer();

	const [ready, setReady] = useState(false);
	const [readying, setReadying] = useState(false);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [finalTime, setFinalTime] = useState<number | void | null>(null);

	const saveSolve = useCallback((time: number, startingTime?: number) => {
		const solveID: SolveID = nanoid();

		const solve: Solve = {
			id: solveID,
			scramble: scramble || "",
			solveTime: finalTime || time,
			startTime: startingTime || startTime || 0
		};

		setSolve(solveID, () => solve);
		session!.solves.push(solveID);
		setSession(session!);
		// setSessions(updatedSessions);
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
			<Box sx={{ justifyContent: 'center', alignItems: 'start', display: 'flex', flexDirection: 'column', width: '100%', height: 'fit-content', outline: 'none' }}>
				<ProfileSelector/>
			</Box>

			<Box sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '48px', outline: 'none' }}>
				<Typography level="body-lg" fontFamily={"Roboto Mono"}>{scramble ? scramble : <Skeleton animation="wave">FF F F FF F' FF FF FF F' FF FF FF FF F' F' FF F FF FF F</Skeleton>}</Typography>
				<Typography fontFamily="Roboto Mono" level="title-md" fontSize={"75pt"} color={ready ? 'success' : (readying ? 'danger' : undefined)}>{formatTime(finalTime ? finalTime : time, timer_precision)}</Typography>
			</Box>
			{/* <ScrambleDisplay event={sessions[session]?.event} scramble={scramble ? scramble : undefined}/> */}
			<Box sx={{ justifyContent: 'center', alignItems: 'center', gap: '14px', display: 'flex', flexDirection: 'row', width: '100%', height: '300px', outline: 'none' }}>
				<Box sx={{ width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden' }}><Solves /></Box>
				{/* <Box sx={{ width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden' }}><Graph /></Box> */}
				<Box sx={{ width: '350px', height: '300px', borderRadius: theme => theme.radius.lg, overflow: 'hidden' }}><Sheet sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ScrambleDisplay event={session.event} scramble={scramble ? scramble : undefined} /></Sheet></Box>
			</Box>
		</Box>
	)
}
function ProfileSelector() {
	const sessionsEntries = useAtomValue(settings.sessions.entries);
	const [ sessionId, setSessionId ] = useAtom(settings.session);
	const sessions = Object.fromEntries(useAtomValue(settings.sessions.entries));
	const setSession = useSetAtom(settings.sessions.set);
	const [ addModalOpen, setAddModalOpen ] = useState(false);

	return <>
		<Modal onClose={() => setAddModalOpen(false)} open={addModalOpen}>
			<ModalDialog>
				<DialogTitle>
					Create new profile
				</DialogTitle>
				<DialogContent>
					A profile contains only the solves finished while it was active.
				</DialogContent>
				<form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault();
					setAddModalOpen(false);
					// @ts-expect-error
					const name: string = event.currentTarget.elements.profile_name.value;
					const id = nanoid();

					setSession(id, {
						event: EventID.Event444,
						id,
						name: name,
						solves: []
					});

					setSessionId(id);
				}}>
					<Stack spacing={2}>
						<FormControl required>
							<FormLabel> Name </FormLabel>
							<Input name="profile_name" required defaultValue={"3x3"}/>
						</FormControl>
						<DialogActions>
							<Button type="submit" variant="solid" color="primary">Create</Button>
							<Button variant="plain" color="neutral" onClick={() => setAddModalOpen(false)}>Cancel</Button>
						</DialogActions>
					</Stack>
				</form>
			</ModalDialog>
		</Modal>
		<ButtonGroup>
			<Select value={sessionId} onChange={(e, v) => setSessionId(v || sessionId)} variant="outlined" sx={{ borderTopRightRadius: '0', borderBottomRightRadius: '0' }}>
				{
					sessionsEntries.map((v) => {
						return <Option key={v[1].id} value={v[1].id}>{v[1].name}</Option>
					})
				}
			</Select>
			<IconButton onClick={() => setAddModalOpen(true)}><Add /></IconButton>
		</ButtonGroup>
	</>;
}

