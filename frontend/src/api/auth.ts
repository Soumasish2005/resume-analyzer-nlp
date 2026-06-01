import api from "./axios";
import { User, LoginResponse } from "@/types/auth";

export const authService = {
  async login(data: any): Promise<LoginResponse> {
    const response = await api.post("/api/v1/auth/login", data);
    return response.data;
  },

  async register(data: any): Promise<User> {
    const response = await api.post("/api/v1/auth/register", data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/v1/auth/logout");
  },
};
