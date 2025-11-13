// src/utils/apiClient.js
const RAW_BASE = (process.env.REACT_APP_API_BASE_URL ?? "").trim();
const BASE = RAW_BASE === "" ? "/api" : RAW_BASE;

const join = (a, b) => `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;

export async function api(path, options = {}) {
  const url = join(BASE, path);
  const {
    method = "GET",
    body,
    headers = {},
    credentials = "same-origin",
    ...rest
  } = options;

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // Tự động stringify JSON body + gắn Content-Type
  let finalBody = body;
  if (
    body !== undefined &&
    typeof body !== "string" &&
    !(body instanceof FormData)
  ) {
    finalBody = JSON.stringify(body);
    finalHeaders["Content-Type"] =
      finalHeaders["Content-Type"] ?? "application/json";
  }

  const res = await fetch(url, {
    method,
    credentials,
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* giữ nguyên text */ data = text;
  }

  if (!res.ok) {
    // đưa thêm status + payload để UI phân loại
    const msg =
      (data && (data.error || data.title || data.message)) ||
      `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  return res.status === 204 ? null : data;
}

// tiện lợi: api.get / api.post
api.get = (path, opts) => api(path, { ...opts, method: "GET" });
api.post = (path, body, opts) => api(path, { ...opts, method: "POST", body });
api.put = (path, body, opts) => api(path, { ...opts, method: "PUT", body });
api.del = (path, opts) => api(path, { ...opts, method: "DELETE" });
