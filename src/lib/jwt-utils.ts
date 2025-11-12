import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface JWTPayload {
  sub?: string; // subject (user ID)
  id?: string | number; // alternative user ID field
  userId?: string | number; // another common user ID field
  partnerId?: string | number; // partner ID field
  exp?: number; // expiration time
  iat?: number; // issued at time
  [key: string]: any; // allow other fields
}

/**
 * Extracts user ID from JWT token
 * @param token - The JWT access token
 * @returns The user ID as a string, or null if not found or token is invalid
 */
export const getUserIdFromToken = (): string | null => {
  try {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    if (!accessToken) {
      return null;
    }

    const decoded = jwtDecode<JWTPayload>(accessToken);
    
    // Try different common fields for user ID
    const userId = decoded.sub || decoded.id || decoded.userId;
    
    if (userId) {
      return String(userId);
    }
    
    return null;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Extracts partner ID from JWT token
 * @param token - The JWT access token
 * @returns The partner ID as a string, or null if not found or token is invalid
 */
export const getPartnerIdFromToken = (): string | null => {
  try {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    if (!accessToken) {
      return null;
    }

    const decoded = jwtDecode<JWTPayload>(accessToken); 
    
    // Try partner ID field first, then fall back to user ID fields
    const partnerId = decoded.id;
    
    if (partnerId) {
      return String(partnerId);
    }
    
    return null;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param token - The JWT access token
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    if (!token) {
      return true;
    }

    const decoded = jwtDecode<JWTPayload>(token);
    
    if (!decoded.exp) {
      return false; // If no expiration, assume it's valid
    }
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // If we can't decode, assume it's expired
  }
};

/**
 * Gets the full decoded JWT payload
 * @param token - The JWT access token
 * @returns The decoded payload or null if invalid
 */
export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    if (!token) {
      return null;
    }

    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};