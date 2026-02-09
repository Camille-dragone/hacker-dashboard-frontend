import { Outlet } from "react-router-dom";
import Sidebar from "./component/Sidebar";

export default function App() {
	return (
		<div className="flex bg-black">
			<Sidebar />

			<main className="relative flex-1 overflow-visible">
				<Outlet />
			</main>
		</div>
	);
}
