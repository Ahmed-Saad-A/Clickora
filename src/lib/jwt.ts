/**
 * Simple JWT decoder utility
 * Note: This only decodes the token without verification
 * For production, you should verify the token signature
 */

export interface JWTPayload {
  userId?: string;
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  iat?: number;
  exp?: number;
  [key: string]: any;
}

/**
 * Decode JWT token without verification
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Extract user ID from JWT token
 * @param token - JWT token string
 * @returns User ID or null if not found
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJWT(token);
  if (!payload) return null;

  // Try different possible user ID fields
  if (payload.userId) return payload.userId;
  if (payload.user?._id) return payload.user._id;
  if (payload.user?.id) return payload.user.id;
  if (payload._id) return payload._id;
  if (payload.id) return payload.id;

  return null;
}

/**
 * Extract user information from JWT token
 * @param token - JWT token string
 * @returns User information or null if not found
 */
export function getUserFromToken(token: string): JWTPayload['user'] | null {
  const payload = decodeJWT(token);
  if (!payload) return null;

  return payload.user || null;
}
