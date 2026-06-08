import axios from "axios";
import { getCsrfHeaders } from "./api";

const apiForm = axios.create({
  baseURL: "/api",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  withCredentials: true,
});

/* =========================
   POST with FormData
========================= */
export const apiPostForm = async <T>(url: string, data: any): Promise<T> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const response = await apiForm.post<T>(url, formData, {
    headers: { "Content-Type": "multipart/form-data", ...getCsrfHeaders() },
  });

  return response.data;
};

/* =========================
   PUT with FormData
========================= */
export const apiPutForm = async <T>(url: string, data: any): Promise<T> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const response = await apiForm.post<T>(url, formData, {
    headers: { "Content-Type": "multipart/form-data", ...getCsrfHeaders() },
  });

  return response.data;
};

export default apiForm;
