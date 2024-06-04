import { atom, getDefaultStore, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Session, SessionID, Sessions, Solve, Solves } from "./types";
import { nanoid } from "nanoid";
import { MiniDb } from "jotai-minidb";

const default_session_id = nanoid();

export const solves = new MiniDb<Solve>({ name: 'Equation-Solves'});
export const sessions = new MiniDb<Session>({initialData: {
	[default_session_id]: {
		id: default_session_id,
		name: '3x3',
		solves: [],
		event: '333'
	}
}, name: 'Equation-Sessions'});

export const timer_precision = atomWithStorage('timer_precision', 2, undefined, {getOnInit: true});
export const timer_delay = atomWithStorage('timer_delay', 0.2, undefined, {getOnInit: true});

export const session = atomWithStorage<SessionID>('session', default_session_id, undefined, { getOnInit: true });

const store = getDefaultStore();

export const dbCreatedPromise = Promise.all([store.get(sessions.suspendBeforeInit), store.get(solves.suspendBeforeInit)]);

// export const sessions = atomWithStorage<Sessions>('sessions', 
// 	{
// 		[default_session_id]: {
// 			id: default_session_id,
// 			name: '3x3',
// 			solves: [],
// 			event:  '333'
// 		}
// 	}
// , undefined, {getOnInit: true});

// export const solves = atomWithStorage<Solves>('solves', {}, undefined, {getOnInit: true});