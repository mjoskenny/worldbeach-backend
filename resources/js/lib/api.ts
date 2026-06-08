import axios from "axios";

const appUrlMeta = document
  .querySelector('meta[name="app-url"]')
  ?.getAttribute('content');

const appBaseUrl = (appUrlMeta || window.location.origin).replace(/\/+$/, "");
const apiBaseUrl = `${appBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "X-CSRF-TOKEN":
      document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
  },
  withCredentials: true,
});

const getCookie = (name: string): string => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length < 2) {
    return "";
  }

  return decodeURIComponent(parts.pop()?.split(";").shift() || "");
};

export const getCsrfHeaders = (): Record<string, string> => {
  const cookieToken = getCookie("XSRF-TOKEN");
  const metaToken =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

  const token = cookieToken || metaToken;

  return token
    ? {
        "X-CSRF-TOKEN": metaToken || token,
        "X-XSRF-TOKEN": token,
      }
    : {};
};

api.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    ...getCsrfHeaders(),
  };

  return config;
});

export const apiUrl = (path: string): string => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${apiBaseUrl}/${normalizedPath}`;
};

export const appAssetUrl = (path: string): string => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${appBaseUrl}/${normalizedPath}`;
};

/* =========================
   GET
========================= */
export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data;
};

/* =========================
   POST (JSON or FormData)
========================= */
export const apiPost = async <T>(
  url: string,
  data: any,
  isFormData = false
): Promise<T> => {
  const response = await api.post<T>(url, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data", ...getCsrfHeaders() }
      : getCsrfHeaders(),
  });

  return response.data;
};

/* =========================
   PUT (JSON or FormData)
========================= */
export const apiPut = async <T>(
  url: string,
  data: any,
  isFormData = false
): Promise<T> => {
  const response = await api.put<T>(url, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data", ...getCsrfHeaders() }
      : getCsrfHeaders(),
  });

  return response.data;
};

/* =========================
   DELETE
========================= */
export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url, {
    headers: getCsrfHeaders(),
  });
  return response.data;
};

export const apiPatch = async <T>(
  url: string,
  data?: any,
  isFormData = false
): Promise<T> => {
  const response = await api.patch<T>(url, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data", ...getCsrfHeaders() }
      : getCsrfHeaders(),
  });

  return response.data;
};

export const apiAuthGet = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url, {
    headers: {
      Accept: "application/json",
    },
  });

  return response.data;
};

export default api;
