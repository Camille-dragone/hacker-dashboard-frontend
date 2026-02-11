import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Matrix from "./pages/Matrix";
import Target from "./pages/Target";

const router = createBrowserRouter([
	{ path: "/", element: <Matrix /> },
	{ path: "/login", element: <Login /> },

	{
		path: "/",
		element: <App />,
		children: [
			{ path: "/dashboard", element: <Dashboard /> },
			{ path: "/targets", element: <Target /> },
			{ path: "/logout", element: <Logout /> },
		],
	},
]);

const rootElement = document.getElementById("root");
if (!rootElement)
	throw new Error(`Your HTML Document should contain a <div id="root"></div>`);

createRoot(rootElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
