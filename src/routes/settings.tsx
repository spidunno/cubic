import { Button, Divider, Option as SelectOption, Select, Stack, Tab, TabList, TabPanel, Tabs, ToggleButtonGroup, Typography, useColorScheme } from "@mui/joy";
import { useAtom } from "jotai";
import { PropsWithChildren } from "react";
import * as settings from '../global_settings';

export default function Settings() {
	const { mode, setMode } = useColorScheme();
	const [ timer_precision, set_timer_precision ] = useAtom(settings.timer_precision);

	return <div style={{ width: '100%', height: '100%', overflowY: 'auto', scrollbarGutter: 'stable' }}>
		<Stack direction="column" gap="8px" width="100%" maxWidth={'650px'} height="fit-content" padding='48px'>
			<Tabs aria-label="Settings Menu" defaultValue={0} sx={{ backgroundColor: 'transparent' }}>
				<TabList sx={{ marginBottom: '24px' }}>
					<Typography sx={{ marginRight: 'auto' }} level="h1">Settings</Typography>

					<Tab>Timer</Tab>
					<Tab>Appearance</Tab>
				</TabList>
				<Stack sx={{'& > div': { padding: '0' }}} direction="column" gap="8px" width="100%" maxWidth={'650px'} height="fit-content">
					<TabPanel value={0}>
					<SettingsItem control={(
							<Select size="sm" sx={{height: '32px', width: '100%', maxWidth: '176px'}} value={timer_precision} onChange={(event, value) => set_timer_precision(value!)}>
								<SelectOption value={0}>0</SelectOption>
								<SelectOption value={1}>1</SelectOption>
								<SelectOption value={2}>2</SelectOption>
								<SelectOption value={3}>3</SelectOption>

							</Select>
						)} title="Timer precision" description={`Amount of decimal points the timer will show.`}/>
					</TabPanel>

					<TabPanel value={1}>
						
						<SettingsItem control={(
							<ToggleButtonGroup size="sm" sx={{ height: '32px', '& button': { width: 'calc(6ch + 22px)' } }} value={mode} onChange={(event, newValue) => setMode(newValue)}>
								<Button value="system">System</Button>
								<Button value="light">Light</Button>
								<Button value="dark">Dark</Button>
							</ToggleButtonGroup>
						)} title="Color Scheme" description={`Choose "System" to automatically use your OS theme.`}/>

						<Divider/>

					</TabPanel>
				</Stack>
			</Tabs>
		</Stack>
	</div>
}

function SettingsItem(props: { control: PropsWithChildren<{}>["children"], title: string, description?: string }) {
	return (
		<Stack marginBottom="24px" direction="row" justifyContent="space-between">
			<Stack direction="column" gap="4px" maxWidth="50%">
				<Typography level="title-lg">{props.title}</Typography>
				{props.description ? <Typography level="body-sm">{props.description}</Typography> : null}
			</Stack>
			{props.control}
		</Stack>
	)
}