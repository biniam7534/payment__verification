// Base API client for the BunnaPay backend.
// TODO: Replace BASE_URL with the deployed backend URL (Railway/Render/etc.)
export const BASE_URL = "https://api.bunnapay.example.com";

async function request(path, { method = "GET", body, token } = {}) {
  // TODO: wire up real fetch call to the BunnaPay backend.
  // const res = await fetch(`${BASE_URL}${path}`, {
  //   method,
  //   headers: {
  //     "Content-Type": "application/json",
  //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //   },
  //   body: body ? JSON.stringify(body) : undefined,
  // });
  // if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  // return res.json();

  // Mocked response for frontend development before the backend is ready.
  return Promise.resolve({ mocked: true, path, method, body });
}

export default request;