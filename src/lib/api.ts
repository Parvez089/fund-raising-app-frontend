// src/lib/api.ts
import axiosClient from "./axiosClient";

export const api = {
  get: (path: string) => axiosClient.get(path),

  post: (path: string, body: object) => axiosClient.post(path, body),

  put: (path: string, body: object) => axiosClient.put(path, body),

  delete: (path: string) => axiosClient.delete(path),
};