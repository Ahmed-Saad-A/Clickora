"use client";

import { useSession } from "next-auth/react";
import { getUserIdFromToken, getUserFromToken } from "@/lib/jwt";

/**
 * Hook: Get user ID from JWT token
 */
export const useUserIdFromToken = () => {
  const { data: session } = useSession();

  if (!session?.accessToken) {
    return null;
  }

  return getUserIdFromToken(session.accessToken);
};

/**
 * Hook: Get user info from JWT token
 */
export const useUserFromToken = () => {
  const { data: session } = useSession();

  if (!session?.accessToken) {
    return null;
  }

  return getUserFromToken(session.accessToken);
};
