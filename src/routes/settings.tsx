import { Button, Divider, Stack, Tab, TabList, TabPanel, Tabs, ToggleButtonGroup, Typography, useColorScheme } from "@mui/joy";

export default function Settings() {
	const { mode, setMode } = useColorScheme();

	return <div style={{ width: '100%', height: '100%', overflowY: 'auto', scrollbarGutter: 'stable' }}>
		<Stack direction="column" gap="8px" width="100%" maxWidth={'650px'} height="fit-content" padding='48px'>
			<Tabs aria-label="Settings Menu" defaultValue={0} sx={{ backgroundColor: 'transparent' }}>
				<TabList sx={{ marginBottom: '24px' }}>
					<Typography sx={{ marginRight: 'auto' }} level="h1">Settings</Typography>

					<Tab>Timer</Tab>
					<Tab>Appearance</Tab>
				</TabList>
				<Stack direction="column" gap="8px" width="100%" maxWidth={'650px'} height="fit-content">
					<TabPanel sx={{padding: '0'}} value={1}>
						<Typography level="title-lg">Color Scheme</Typography>
						<ToggleButtonGroup value={mode} onChange={(event, newValue) => setMode(newValue)}>
							<Button value="system">System</Button>
							<Button value="light">Light</Button>
							<Button value="dark">Dark</Button>
						</ToggleButtonGroup>
					</TabPanel>
					
				</Stack>
			</Tabs>
		</Stack>
	</div>
}