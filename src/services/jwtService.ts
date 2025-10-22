import { SignJWT, jwtVerify, decodeJwt } from 'jose';

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface JWTPayload {
  uid: string;
  email: string;
  iat: number;
  exp: number;
}

export class JWTService {
  /**
   * Generate a JWT token for a user
   * @param uid - User ID from Firebase
   * @param email - User email
   * @returns JWT token string
   */
  static async generateToken(uid: string, email: string): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const now = Math.floor(Date.now() / 1000);
    
    const token = await new SignJWT({
      uid,
      email
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime('24h')
      .setIssuer('milaf-cola-app')
      .setAudience('milaf-cola-users')
      .sign(secret);

    return token;
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid
   */
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret, {
        issuer: 'milaf-cola-app',
        audience: 'milaf-cola-users'
      });
      
      return payload as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Check if a token is expired
   * @param token - JWT token string
   * @returns true if expired, false if valid
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = decodeJwt(token) as JWTPayload;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Get token from localStorage
   * @returns JWT token string or null
   */
  static getStoredToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Store token in localStorage
   * @param token - JWT token string
   */
  static storeToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  /**
   * Remove token from localStorage
   */
  static removeToken(): void {
    localStorage.removeItem('jwt_token');
  }

  /**
   * Get current user from stored token
   * @returns User info from token or null if invalid/expired
   */
  static async getCurrentUser(): Promise<{ uid: string; email: string } | null> {
    const token = this.getStoredToken();
    
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      this.removeToken();
      return null;
    }

    const decoded = await this.verifyToken(token);
    if (!decoded) return null;

    return {
      uid: decoded.uid,
      email: decoded.email
    };
  }

  /**
   * Refresh token if it's close to expiring (within 1 hour)
   * @param uid - User ID
   * @param email - User email
   * @returns New token if refreshed, null if not needed
   */
  static async refreshTokenIfNeeded(uid: string, email: string): Promise<string | null> {
    const token = this.getStoredToken();
    if (!token) return null;

    try {
      const decoded = decodeJwt(token) as JWTPayload;
      if (!decoded || !decoded.exp) return null;

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;
      
      // Refresh if token expires within 1 hour (3600 seconds)
      if (timeUntilExpiry < 3600) {
        const newToken = await this.generateToken(uid, email);
        this.storeToken(newToken);
        return newToken;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }
}
