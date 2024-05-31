import { Outlet, useMatch } from "react-router-dom";
import '@fontsource/inter';
import { Stack } from "@mui/joy";
import { Settings, SettingsOutlined, Timer, TimerOutlined } from "@mui/icons-material";
import LinkButton from "../components/LinkButton";
import CubicLogo from "../assets/cubic_logo";

export default function Root() {
	return (
		<Stack direction="row" sx={{width: '100%', height: '100%'}}>
			<Sidebar/>
			<Outlet/>
		</Stack>
	);
}

function Sidebar() {
	return (
		<Stack gap={'12px'} direction="column" sx={{paddingTop: '18px', width: '72px', minWidth: '72px', height: '100%', borderRight: theme => `1px solid ${theme.palette.divider}`, 
		/* STUPID HACK */
		'& > *': {
			marginLeft: 'auto !important', marginRight: 'auto !important'
		}}}>
			<CubicLogo style={{marginBottom: '6px'}}/>
				<LinkButton to="/" sx={{height: '48px', width: '48px', borderRadius: theme => theme.radius.lg}} variant={useMatch('/') === null ? 'plain' : 'soft'}>{({isActive}) => isActive ? <Timer/> : <TimerOutlined/>}</LinkButton>
			<LinkButton to="/settings"  sx={{height: '48px', width: '48px', borderRadius: theme => theme.radius.lg}} variant={useMatch('/settings') === null ? 'plain' : 'soft'}>{({isActive}) => isActive ? <Settings/> : <SettingsOutlined/>}</LinkButton>
		</Stack>
	)
}