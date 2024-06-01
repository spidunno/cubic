import { useAtom } from 'jotai';
import * as settings from '../global_settings';
import { useColorScheme } from '@mui/joy';
import ScrambleDisplay from '../components/ScrambleDisplay';

export default function App() {
  // const { mode, setMode } = useColorScheme();
	const [ sessions, setSessions ] = useAtom(settings.sessions);
	const [ session, setSession ] = useAtom(settings.session);

	return (
    <div style={{width: '100%', height: '100%', padding: '48px'}}>
			{JSON.stringify(sessions)}
			<ScrambleDisplay event={sessions[session]?.event}/>
    </div>
  )
}