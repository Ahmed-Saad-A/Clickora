"use client";

import { useSession } from "next-auth/react";
import { getUserIdFromToken } from "@/lib/jwt";

/**
 * Custom hook to get user ID from JWT token
 * @returns User ID from token or null if not available
 */
export const useUserIdFromToken = () => {
  const { data: session } = useSession();
  
  if (!session?.accessToken) {
    return null;
  }

  return getUserIdFromToken(session.accessToken);
};

/**
 * Custom hook to get user information from JWT token
 * @returns User information from token or null if not available
 */
export const useUserFromToken = () => {
  const { data: session } = useSession();
  
  if (!session?.accessToken) {
    return null;
  }

  const { getUserFromToken } = require("@/lib/jwt");
  return getUserFromToken(session.accessToken);
};
