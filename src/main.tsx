import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App";
import Matrix from "./pages/Matrix";
import Dashboard from "./pages/Dashboard";
import Target from "./pages/Target";

const router = createBrowserRouter([
  // ✅ Page d’entrée “Matrix” SANS sidebar
  {
    path: "/",
    element: <Matrix />,
  },

  // ✅ Le reste du site AVEC sidebar (App.tsx)
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/targets",
        element: <Target />,
      },
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
