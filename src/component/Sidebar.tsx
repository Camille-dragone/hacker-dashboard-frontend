import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logohacker1.png";

export default function Sidebar() {
	return (
		<aside className="z-20 flex h-auto w-64 flex-col bg-black border-r border-green-500/20 pt-6 font-mono">
			<Link to="/" className="mt-4 flex h-40 items-center justify-center">
				<img src={logo} alt="Hacker Dashboard logo" className="h-26 w-auto" />
			</Link>

			<nav className="mt-16 flex flex-col gap-4 px-6">
				<NavLink
					to="/dashboard"
					className={({ isActive }) =>
						`rounded-md px-4 py-3 text-sm font-medium tracking-wide transition ${
							isActive
								? "bg-green-500/10 text-green-400"
								: "text-green-300 hover:bg-green-500/5 hover:text-green-200"
						}`
					}
				>
					Dashboard
				</NavLink>

				<NavLink
					to="/targets"
					className={({ isActive }) =>
						`rounded-md px-4 py-3 text-sm font-medium tracking-wide transition ${
							isActive
								? "bg-green-500/10 text-green-400"
								: "text-green-300 hover:bg-green-500/5 hover:text-green-200"
						}`
					}
				>
					Targets
				</NavLink>
				<NavLink
					to="/logout"
					className={({ isActive }) =>
						`rounded-md px-4 py-3 text-sm font-medium tracking-wide transition ${
							isActive
								? "bg-green-500/10 text-green-400"
								: "text-green-300 hover:bg-green-500/5 hover:text-green-200"
						}`
					}
				>
					Déconnexion
				</NavLink>
			</nav>
		</aside>
	);
}
