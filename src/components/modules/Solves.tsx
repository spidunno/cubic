import { Button, Card, DialogActions, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Sheet, Table, Typography } from '@mui/joy';
import * as settings from '../../global_settings';
import { useAtom } from 'jotai';
import { formatTime } from '../../util';
import type { Solve } from '../../types';
import { Close, Warning } from '@mui/icons-material';
import { useState } from 'react';

export default function Solves() {
	const [sessions] = useAtom(settings.sessions);
	const [session] = useAtom(settings.session);
	const [solves] = useAtom(settings.solves);

	return <Sheet sx={{ padding: '16px', width: '100%', height: '100%', maxHeight: '100%', minHeight: '100%', overflowY: 'auto', display: 'flex', alignItems: Object.keys(solves).length === 0 ? 'center' : 'start', justifyContent: 'center', flexDirection: 'row' }}>
		{Object.keys(solves).length === 0 ? <Typography level="body-sm">No solves yet</Typography> :
			<Table size="md" sx={{ minHeight: '100%', display: 'flex' }}>
				<tbody style={{ width: '100%' }}>
					{[...sessions[session]?.solves!].map(v => ({ ...solves[v] })).filter(v => v).toSorted((a, b) => {
						if (a!.startTime! < b!.startTime!) {
							return 1;
						} else if (a!.startTime! > b!.startTime!) {
							return -1;
						} else return 0;
					}).map((v, i, a) => {
						// @ts-ignore
						if (v) return <Row i={i} v={v} a={a} key={i}/>;
					})}
				</tbody>
			</Table>
		}
	</Sheet>
}

function Row({i, a, v}: {i: number, a: Solve[], v: Solve}) {
	const [sessions, setSessions] = useAtom(settings.sessions);
	const [session] = useAtom(settings.session);
	const [solves, setSolves] = useAtom(settings.solves);
	const [ open, setOpen ] = useState(false);
	const [solveDate] = useState(new Date(v.startTime + v.solveTime));
	return <>
	<Modal open={open} onClose={() => setOpen(false)}>
		<ModalDialog>
			<DialogTitle>
				<Warning/>
				Confirmation
			</DialogTitle>
			<DialogContent>
				<Typography sx={{marginBottom: '16px'}}>Are you sure you want to delete this solve?</Typography>
				<Card>
					<div>
						<Typography level="title-lg">{formatTime(v.solveTime, 2)} Seconds</Typography>
						<Typography level="body-sm">{
							[
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December",
							][solveDate.getMonth()] +
								" " +
								solveDate.getDate() +
								", " +
								solveDate.getFullYear() +
								" at " +
								solveDate.toLocaleTimeString()
						}</Typography>
					</div>
					<Typography level="body-md">{v.scramble}<br/></Typography>
				</Card>
			</DialogContent>
			<DialogActions>
				<Button variant="solid" color="danger" onClick={() => {
					const updatedSolves = {...solves};
					const updatedSessions = {...sessions};
					updatedSessions[session]!.solves = updatedSessions[session]!.solves.filter(value => value !== v.id);
					delete updatedSolves[v.id];
					setSolves(updatedSolves);
					setSessions(updatedSessions);
					setOpen(false);
				}}>Delete</Button>
				<Button variant="plain" color="neutral" onClick={() => setOpen(false)}>Cancel</Button>
			</DialogActions>
		</ModalDialog>
	</Modal>
		<tr>
			<td>{(a.length - i).toString()}.</td>
			<td style={{ width: '100%' }}>{formatTime(v!.solveTime!, 2)}</td>
			<td><IconButton onClick={() => setOpen(true)} size="sm" sx={{ marginRight: 'auto', marginLeft: '0' }}><Close /></IconButton></td>
		</tr>
		</>
}