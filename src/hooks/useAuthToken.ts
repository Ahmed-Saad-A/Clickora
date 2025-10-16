"use client";

import { useSession } from "next-auth/react";

export const useAuthToken = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return session?.accessToken || null;
};
 