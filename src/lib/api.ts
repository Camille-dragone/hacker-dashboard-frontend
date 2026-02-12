export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const base = import.meta.env.VITE_API_URL ?? "";
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${txt}`);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return (await res.text()) as unknown as T;
  }

  const raw = await res.text();
  if (!raw) return undefined as T;

  return JSON.parse(raw) as T;
}
