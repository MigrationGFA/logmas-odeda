/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../lib/api";



// Service functions with standalone fallback logic
export const services = {
  listServices: () => api.get<any>("/services"),

  getServiceBySlug: (slug: string) =>
    api.get<any>(`/services/${slug}`),
};
