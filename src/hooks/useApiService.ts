"use client";

import { useEffect } from "react";
import { servicesApi } from "@/Services/api";
import { useAuthToken } from "./useAuthToken";

export const useApiService = () => {
  const token = useAuthToken();

  useEffect(() => {
    if (token) {
      servicesApi.setToken(token);
    }
  }, [token]);

  return servicesApi;
};
 