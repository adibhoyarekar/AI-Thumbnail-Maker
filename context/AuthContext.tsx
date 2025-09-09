import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, BrandKit, SignUpDataWithPassword, HistoryItem } from '../types';
import authService from '../services/authService';
import { dbService } from '../services/databaseService';

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
    upgradePlan: () => void;
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

    const fetchAllUserData = (userId: string) => {
        setBrandKit(dbService.getBrandKit(userId));
        setHistory(dbService.getHistory(userId));
        setFavorites(dbService.getFavorites(userId));
    };
    
    useEffect(() => {
        // Check for a logged-in user in sessionStorage on initial load
        const loggedInUserId = sessionStorage.getItem('thumbnail_ai_user_id');
        if (loggedInUserId) {
            const sessionUser = dbService.findUserById(loggedInUserId);
            if (sessionUser) {
                // Remove password before setting user state
                const { password, ...clientUser } = sessionUser;
                setUser(clientUser);
                fetchAllUserData(clientUser.id);
            }
        }
        setIsLoading(false);
    }, []);

    const handleAuthSuccess = (authenticatedUser: User) => {
        sessionStorage.setItem('thumbnail_ai_user_id', authenticatedUser.id);
        const { password, ...clientUser } = authenticatedUser; // Ensure password is not in state
        setUser(clientUser);
        fetchAllUserData(clientUser.id);
    };

    const login = async (email: string, password: string): Promise<void> => {
        const authenticatedUser = await authService.login(email, password);
        handleAuthSuccess(authenticatedUser);
    };

    const signup = async (data: SignUpDataWithPassword): Promise<void> => {
        const newUser = await authService.signup(data);
        handleAuthSuccess(newUser);
    };
    
    const socialLogin = async (provider: 'google' | 'facebook'): Promise<void> => {
        const authenticatedUser = await authService.socialLogin(provider);
        handleAuthSuccess(authenticatedUser);
    };

    const logout = () => {
        setUser(null);
        setBrandKit(null);
        setHistory([]);
        setFavorites([]);
        sessionStorage.removeItem('thumbnail_ai_user_id');
    };
    
    const saveBrandKit = async (kit: BrandKit): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        dbService.saveBrandKit(user.id, kit);
        setBrandKit(kit);
    };
    
    const saveHistory = async (newHistory: HistoryItem[]): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        dbService.saveHistory(user.id, newHistory);
        setHistory(newHistory);
    };

    const saveFavorites = async (newFavorites: string[]): Promise<void> => {
        if (!user) throw new Error("User must be logged in.");
        dbService.saveFavorites(user.id, newFavorites);
        setFavorites(newFavorites);
    };

    const upgradePlan = () => {
        if (user) {
            const upgradedUser = { ...user, plan: 'Premium' as const };
            dbService.saveUser(upgradedUser); // Save change to mock DB
            setUser(upgradedUser);
        }
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
