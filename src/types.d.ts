import { Alg } from "cubing/alg";

export interface Session {
	id: SessionID,
	name: string,
	// List of solve id's
	solves: SolveID[],
	event: string;
}

export type SolveID = string;
export type SessionID = string;

export interface Solve {
	scramble: string;
	solveTime: number;
	startTime: number;
	dnf?: boolean;
	penalty?: number;
	id: SolveID;
};

export interface Solves {
	[K: SolveID]: Solve | undefined;
}

export interface Sessions {
	[k: SessionID]: Session | undefined;
}