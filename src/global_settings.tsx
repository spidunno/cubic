import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Session, SessionID, Sessions, Solves } from "./types";
import { nanoid } from "nanoid";

export const timer_precision = atomWithStorage('timer_precision', 2, undefined, {getOnInit: true});
export const timer_delay = atomWithStorage('timer_delay', 0.2, undefined, {getOnInit: true});

const default_session_id = nanoid();

export const session = atomWithStorage<SessionID>('session', default_session_id, undefined, { getOnInit: true });
export const sessions = atomWithStorage<Sessions>('sessions', 
	{
		[default_session_id]: {
			id: default_session_id,
			name: '3x3',
			solves: [],
			event:  '333'
		}
	}
, undefined, {getOnInit: true});

export const solves = atomWithStorage<Solves>('solves', {}, undefined, {getOnInit: true});