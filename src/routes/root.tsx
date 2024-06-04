import { Link, Outlet, useMatch } from "react-router-dom";
import '@fontsource/inter';
import '@fontsource/roboto-mono'
import { Sheet, Stack } from "@mui/joy";
import { Settings, SettingsOutlined, Timer, TimerOutlined } from "@mui/icons-material";
import LinkButton from "../components/LinkButton";
import CubicLogo from "../assets/cubic_logo";
import * as settings from '../global_settings';
import { useAtom, useAtomValue } from "jotai";
import { useEffect, use } from "react";

export default function Root() {
	const [session, setSession] = useAtom(settings.session);
	use(settings.dbCreatedPromise);
	if (localStorage.getItem('session') === null) {
		setSession(session);
	}

	useEffect(() => {
		if (localStorage.getItem('session') === null) {
			setSession(session);
		}
	}, []);

	return (
		<Stack direction="row" sx={{width: '100%', height: '100%'}}>
			<Sidebar/>
			<Outlet/>
		</Stack>
	);
}

function Sidebar() {
	return (
		<Sheet sx={{gap: '12px', flexDirection: 'column', display: 'flex', paddingTop: '18px', width: '72px', minWidth: '72px', height: '100%', borderRight: theme => `1px solid ${theme.palette.divider}`, 
		/* STUPID HACK */
		'& > *': {
			marginLeft: 'auto !important', marginRight: 'auto !important'
		}}}>
				<LinkButton to="/" sx={{height: '48px', width: '48px', borderRadius: theme => theme.radius.lg}} variant={useMatch('/') === null ? 'plain' : 'soft'}>{({isActive}) => isActive ? <Timer/> : <TimerOutlined/>}</LinkButton>
			<LinkButton to="/settings"  sx={{height: '48px', width: '48px', borderRadius: theme => theme.radius.lg}} variant={useMatch('/settings') === null ? 'plain' : 'soft'}>{({isActive}) => isActive ? <Settings/> : <SettingsOutlined/>}</LinkButton>
			<Link to="/" style={{color: 'inherit', marginBottom: '12px', marginTop: 'auto'}}><CubicLogo/></Link>
		</Sheet>
	)
}