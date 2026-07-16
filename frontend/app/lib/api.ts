const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL;

if (!RAW_API_BASE) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in the environment variables.");
}

// Strip trailing slash to avoid double slashes (e.g. //auth/login) during joins
const API_BASE = RAW_API_BASE.endsWith("/") ? RAW_API_BASE.slice(0, -1) : RAW_API_BASE;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${cleanPath}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Unable to connect to server");
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new ApiError(res.status, "Invalid response from server");
  }

  if (!res.ok) {
    throw new ApiError(res.status, data.error || "Something went wrong");
  }

  return data;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
