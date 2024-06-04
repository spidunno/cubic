import { Button, Card, DialogActions, DialogContent, DialogTitle, IconButton, Modal, ModalDialog, Sheet, Table, Typography, useTheme } from '@mui/joy';
import * as settings from '../../global_settings';
import { atom, useAtom, useAtomValue } from 'jotai';
import { formatTime } from '../../util';
import type { Session, Solve } from '../../types';
import { Close, Warning } from '@mui/icons-material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { lineY, plot } from '@observablehq/plot';

class MyCurve {
	_context: Path2D;
	_line: number = NaN;
	_point: number = NaN;

	oldX: number = 0;
	oldY: number = 0;
  constructor(context: Path2D) {
		this._context = context;
	}

  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  }
  point(x: number, y: number) {
    // x = +x, y = +y;
    switch (this._point) {
      case 0: {this.oldX = x; this.oldY = y; this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;}
      case 1: {this._point = 2; } // falls through
      default: this._context.bezierCurveTo(lerp(this.oldX, x, .3642124232), this.oldY, lerp(this.oldX, x, 0.6357875768), y, x, y); this.oldX = x; this.oldY = y; break;
      // default: this._context.lineTo(x, y); break;
    }
  }
};

export default function Graph() {
	const graphRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();
	// const [sessionId] = useAtom(settings.session);
	// const [session] = useAtom(settings.sessions.item(sessionId));
	const [session, setSession] = useAtom(useMemo(() => 
		atom((get) => {
			return get(settings.sessions.item(get(settings.session)))
		},
		(_get, set, newSession: Session) => {
			set(settings.sessions.item(_get(settings.session)), newSession)
		}), []));
	const solves = Object.fromEntries(useAtomValue(settings.solves.entries));

	useEffect(() => {
		if (session && graphRef.current) {
			let data = session.solves.filter(v => v in solves).map(v => {return {date: new Date(solves[v]!.startTime + solves[v]!.solveTime), solveTime: solves[v]!.solveTime/1000}})
			if (data.length < 2) return;
			const graph = plot({
				width: 350,
				height: 300,
				marks: [
					lineY(data, { stroke: theme.palette.primary[500], imageFilter: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="glow"><feGaussianBlur stdDeviation="7.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></svg>#glow')`, strokeWidth: 4, curve: 'monotone-x', x: "date", y: "solveTime", margin: 0 })
				]
			});
			graphRef.current.appendChild(graph);
			return () => {
				if (graphRef.current) {
					graphRef.current.removeChild(graph);
				}
			}
		}
	}, [solves]);

	return <Sheet ref={graphRef} sx={{ padding: '16px', width: '100%', height: '100%', maxHeight: '100%', minHeight: '100%', overflowY: 'auto', display: 'flex', alignItems: Object.keys(solves).length < 2 ? 'center' : 'start', justifyContent: 'center', flexDirection: 'row' }}>
		{Object.keys(solves).length < 2 ? <Typography level="body-sm">Not enough solves yet</Typography> : null}
	</Sheet>
}

function lerp(a: number, b: number, t: number): number {
	return a*(1-t)+b*t;
}