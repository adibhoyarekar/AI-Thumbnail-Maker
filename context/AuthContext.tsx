import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, BrandKit, SignUpDataWithPassword, HistoryItem } from '../types';

// Helper for API calls
const apiService = {
  async request(endpoint: string, options: RequestInit = {}) {
    // In a real project, the base URL would come from an environment variable
    const API_BASE_URL = 'http://localhost:5000/api'; 
    const token = sessionStorage.getItem('thumbnail_ai_token');
    
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ msg: 'An unknown API error occurred' }));
            throw new Error(errorData.msg || `Request failed with status ${response.status}`);
        }

        // Handle successful responses that might not have a JSON body (e.g., 204 No Content)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json();
        }
        return {}; // Return empty object for non-json success responses

    } catch (error) {
        console.error(`API request to ${endpoint} failed:`, error);
        throw error;
    }
  },
  get: (endpoint: string) => apiService.request(endpoint),
  post: (endpoint: string, body: any) => apiService.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};


interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    brandKit: BrandKit | null;
    history: HistoryItem[];
    favorites: string[];
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signup: (data: SignUpDataWithPassword) => Promise<void>;
    socialLogin: (provider: 'google' | 'facebook') => Promise<void>;
    upgradePlan: () => void; // This will remain a mock for now
    saveBrandKit: (kit: BrandKit) => Promise<void>;
    saveHistory: (history: HistoryItem[]) => Promise<void>;
    saveFavorites: (favorites: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAllUserData = async () => {
        try {
            const [brandKitData, historyData, favoritesData] = await Promise.all([
                apiService.get('/data/brandkit'),
                apiService.get('/data/history'),
                apiService.get('/data/favorites'),
            ]);
            setBrandKit(brandKitData.kit || null);
            setHistory(historyData.history || []);
            setFavorites(favoritesData.favorites || []);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            // Don't log out here, token might still be valid for other operations
        }
    };
    
    useEffect(() => {
        const loadUser = async () => {
            const token = sessionStorage.getItem('thumbnail_ai_token');
            if (token) {
                try {
                    const userData = await apiService.get('/auth/me');
                    setUser(userData);
                    await fetchAllUserData();
                } catch (error) {
                    console.error("Session token is invalid or expired.", error);
                    sessionStorage.removeItem('thumbnail_ai_token');
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    const handleAuthSuccess = async (data: { token: string, user: User }) => {
        sessionStorage.setItem('thumbnail_ai_token', data.token);
        setUser(data.user);
        await fetchAllUserData();
    };

    const login = async (email: string, password: string): Promise<void> => {
        const data = await apiService.post('/auth/login', { email, password });
        await handleAuthSuccess(data);
    };

    const signup = async (data: SignUpDataWithPassword): Promise<void> => {
        const { fullName, username, email, password, profilePhoto, role, preferredLanguage } = data;
        const responseData = await apiService.post('/auth/register', { fullName, username, email, password, profilePhoto, role, preferredLanguage });
        await handleAuthSuccess(responseData);
    };
    
    const socialLogin = async (provider: 'google' | 'facebook'): Promise<void> => {
        // This remains a mock for simplicity, logging in as a pre-defined premium user
        const data = await apiService.post('/auth/login', { email: 'premium@example.com', password: 'Password1!' });
        await handleAuthSuccess(data);
    };

    const logout = () => {
        setUser(null);
        setBrandKit(null);
        setHistory([]);
        setFavorites([]);
        sessionStorage.removeItem('thumbnail_ai_token');
    };
    
    const saveBrandKit = async (kit: BrandKit): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        const updatedKit = await apiService.post('/data/brandkit', { kit });
        setBrandKit(updatedKit.kit);
    };
    
    const saveHistory = async (newHistory: HistoryItem[]): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        setHistory(newHistory); // Optimistic update
        await apiService.post('/data/history', { history: newHistory });
    };

    const saveFavorites = async (newFavorites: string[]): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        setFavorites(newFavorites); // Optimistic update
        await apiService.post('/data/favorites', { favorites: newFavorites });
    };

    const upgradePlan = () => { // Mock upgrade
        if (user) setUser({ ...user, plan: 'Premium' });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, brandKit, history, favorites, login, logout, signup, socialLogin, upgradePlan, saveBrandKit, saveHistory, saveFavorites }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
