// src/utils/apiClient.js
const RAW_BASE = (process.env.REACT_APP_API_BASE_URL ?? "").trim();
const BASE = RAW_BASE === "" ? "/api" : RAW_BASE;

const join = (a, b) => `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;

export async function api(path, options = {}) {
  const url = join(BASE, path);
  const { method = "GET", body, headers = {}, ...rest } = options;

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // ƯU TIÊN idToken, rồi mới tới access_token
  const token =
    localStorage.getItem("idToken") || localStorage.getItem("access_token");

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let finalBody = body;
  if (body && typeof body !== "string" && !(body instanceof FormData)) {
    finalBody = JSON.stringify(body);
    finalHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // KHÔNG logout / redirect ở đây
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    
    // Log để debug
    if (res.status === 401) {
      console.error('❌ Authentication failed:', {
        url,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
      });
    }
    
    throw err;
  }

  return data;
}

api.get = (path, opts) => api(path, { ...opts, method: "GET" });
api.post = (path, body, opts) => api(path, { ...opts, method: "POST", body });
api.put = (path, body, opts) => api(path, { ...opts, method: "PUT", body });
api.del = (path, opts) => api(path, { ...opts, method: "DELETE" });
