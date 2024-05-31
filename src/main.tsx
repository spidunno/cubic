import React from 'react';
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


const router = createBrowserRouter([
	{
		path: '/',
		element: <Root/>,
		children: [
			{
				path: '/',
				element: <App/>
			},
			{
				path: '/settings',
				element: <Settings/>
			}
		]
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
		<CssVarsProvider defaultMode="system">
			<CssBaseline/>
    <RouterProvider router={router}/>
		</CssVarsProvider>
  </React.StrictMode>,
)
