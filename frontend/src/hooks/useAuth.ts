import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      
      // Fetch user profile after login
      const user = await authService.getMe();
      setAuth(user);
      
      navigate("/dashboard");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate("/login");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      navigate("/login");
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });
};
