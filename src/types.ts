import { Alg } from "cubing/alg";

export interface Session {
	id: SessionID,
	name: string,
	// List of solve ids
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

// export type EventID = "222"
// 										| "555"
// 										| "666"
// 										| "777"
// 										| "minx"
// 										| "pyram"
// 										| "555bf"
// 										| "333"
// 										| "333oh"
// 										| "333ft"
// 										| "333bf"
// 										| "333mbf"
// 										| "444"
// 										| "444bf"
// 										| "skewb"
// 										| "sq1"
// 										| "fto"
// 										| "master_tetraminx"
// 										| "kilominx"
// 										| "redi_cube"

export enum EventID {
	Event222="222",
	Event555="555",
	Event666="666",
	Event777="777",
	EventMinx="minx",
	EventPyram="pyram",
	Event555bf="555bf",
	Event333="333",
	Event333oh="333oh",
	Event333ft="333ft",
	Event333bf="333bf",
	Event333mbf="333mbf",
	Event444="444",
	Event444bf="444bf",
	EventSkewb='skewb',
	EventSquare1="sq1",
	EventFTO="fto",
	EventMasterTetraminx="master_tetraminx",
	EventKilominx="kilominx",
	EventRediCube="redi_cube"
}