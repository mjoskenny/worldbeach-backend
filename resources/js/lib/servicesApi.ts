import { Service } from "../types/services";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";

export const getServices = () =>
  apiGet<Service[]>("/services");

export const createService = (data: Omit<Service, "id">) =>
  apiPost<Service>("/services", data);

export const updateService = (id: number, data: Omit<Service, "id">) =>
  apiPut<Service>(`/services/${id}`, data);

export const deleteService = (id: number) =>
  apiDelete(`/services/${id}`);
