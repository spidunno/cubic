import { useAtom } from 'jotai';
import * as settings from '../global_settings';
import { useColorScheme } from '@mui/joy';

export default function App() {
  const { mode, setMode } = useColorScheme();
	
	return (
    <div style={{width: '100%', height: '100%', padding: '48px'}}>
			{mode}
    </div>
  )
}