import { JWTService } from './jwtService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  private static baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  /**
   * Make an authenticated API request
   * @param endpoint - API endpoint
   * @param options - Fetch options
   * @returns Promise with API response
   */
  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = JWTService.getStoredToken();
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found. Please log in.'
        };
      }

      // Check if token is expired
      if (JWTService.isTokenExpired(token)) {
        JWTService.removeToken();
        return {
          success: false,
          error: 'Authentication token expired. Please log in again.'
        };
      }

      // Verify token is valid
      const isValid = await JWTService.verifyToken(token);
      if (!isValid) {
        JWTService.removeToken();
        return {
          success: false,
          error: 'Invalid authentication token. Please log in again.'
        };
      }

      const url = `${this.baseURL}${endpoint}`;
      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, clear it
          JWTService.removeToken();
          return {
            success: false,
            error: 'Authentication failed. Please log in again.'
          };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `Request failed with status ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      };
    }
  }

  /**
   * GET request
   */
  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  static async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  static async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Upload file with authentication
   */
  static async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const token = JWTService.getStoredToken();
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found. Please log in.'
        };
      }

      if (JWTService.isTokenExpired(token)) {
        JWTService.removeToken();
        return {
          success: false,
          error: 'Authentication token expired. Please log in again.'
        };
      }

      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          JWTService.removeToken();
          return {
            success: false,
            error: 'Authentication failed. Please log in again.'
          };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `Upload failed with status ${response.status}`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('File upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }
}
