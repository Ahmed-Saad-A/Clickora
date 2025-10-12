/**
 * Test utility for JWT token decoding
 * This can be used to test the JWT decoding functionality
 */

import { decodeJWT, getUserIdFromToken, getUserFromToken } from './jwt';

// Example JWT token structure (this would be a real token from your API)
const exampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM1NGM3MzFkM2VhNjU0ZDU3MDNlMWEiLCJ1c2VyIjp7Il9pZCI6IjY4YzU0YzczMWQzZWE2NTRkNTcwM2UxYSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCJ9LCJpYXQiOjE3MzQ5NjAwMDAsImV4cCI6MTczNDk2MzYwMH0.example_signature";

export function testJWTDecoding() {
  console.log("Testing JWT Token Decoding...");
  
  // Test with a sample token (you can replace this with a real token)
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGM1NGM3MzFkM2VhNjU0ZDU3MDNlMWEiLCJ1c2VyIjp7Il9pZCI6IjY4YzU0YzczMWQzZWE2NTRkNTcwM2UxYSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCJ9LCJpYXQiOjE3MzQ5NjAwMDAsImV4cCI6MTczNDk2MzYwMH0.example_signature";
  
  try {
    // Test full payload decoding
    const payload = decodeJWT(testToken);
    console.log("Decoded payload:", payload);
    
    // Test user ID extraction
    const userId = getUserIdFromToken(testToken);
    console.log("Extracted user ID:", userId);
    
    // Test user info extraction
    const userInfo = getUserFromToken(testToken);
    console.log("Extracted user info:", userInfo);
    
    return {
      success: true,
      payload,
      userId,
      userInfo
    };
  } catch (error) {
    console.error("JWT decoding test failed:", error);
    return {
      success: false,
      error: String(error)
    };
  }
}

// Function to test with real token from session
export function testWithRealToken(token: string) {
  console.log("Testing with real token...");
  
  try {
    const userId = getUserIdFromToken(token);
    const userInfo = getUserFromToken(token);
    
    console.log("Real token user ID:", userId);
    console.log("Real token user info:", userInfo);
    
    return {
      success: true,
      userId,
      userInfo
    };
  } catch (error) {
    console.error("Real token test failed:", error);
    return {
      success: false,
      error: String(error)
    };
  }
}
