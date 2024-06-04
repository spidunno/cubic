import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/app.tsx';
import './index.css';
import {
	createBrowserRouter,
	RouterProvider
} from 'react-router-dom';
import Root from './routes/root.tsx';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import Settings from './routes/settings.tsx';
import 'scramble-display';
import { getDefaultStore, } from 'jotai';

// export const store = getDefaultStore();

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <App />
			},
			{
				path: '/settings',
				element: <Settings />
			}
		]
	}
]);

// I'm calling this to make sure that the database is initialized before the first render. If it isn't errors occur and all sorts of bad stuff happens.
// Promise.all([store.get(sessions.suspendBeforeInit), await store.get(solves.suspendBeforeInit)]).then(() => {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<CssVarsProvider defaultMode="system">
				<CssBaseline />
				<Suspense><RouterProvider router={router} /></Suspense>
			</CssVarsProvider>
		</React.StrictMode>,
	)
// })
