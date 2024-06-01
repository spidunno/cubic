import type { ScrambleDisplay as ScrambleDisplayElement, ScrambleDisplayAttributes } from '../../node_modules/scramble-display/dist/types/ScrambleDisplay';
import { HTMLProps, useEffect, useRef } from 'react';
import { PropsOf } from '@emotion/react';
import { styled } from '@mui/joy';
declare global {
	namespace JSX {
		interface IntrinsicElements {
			"scramble-display": HTMLProps<HTMLElement> & ScrambleDisplayAttributes
		}
	}
}


export const ScrambleDisplayStyled = styled('scramble-display')(() => ({}));

export default function ScrambleDisplay(props: PropsOf<'scramble-display'>) {
	const element = useRef<ScrambleDisplayElement>(null);
	
	useEffect(() => {
		if (element.current) {
			// @ts-expect-error This is already so hacky of course there's a type error
			const elem = (element.current.player?.shadow.querySelector('twisty-2d-scene-wrapper')?.shadow)?.querySelector('twisty-2d-puzzle')?.shadow?.querySelector('svg') as SVGSVGElement;
			const html = element.current.innerHTML;
			element.current.innerHTML = html.replaceAll('red', 'rebeccapurple');
		}
	});
	
	return <scramble-display ref={element} {...props}/>
}