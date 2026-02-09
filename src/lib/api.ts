const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
		...options,
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `Erreur API ${res.status}`);
	}

	return res.json() as Promise<T>;
}
