import { dbService, type DBUser } from './databaseService';
import type { SignUpDataWithPassword } from '../types';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
    login: async (email: string, password: string): Promise<DBUser> => {
        await delay(500); // Simulate network latency
        const user = dbService.findUserByEmail(email);
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password.');
        }
        // In a real backend, you'd compare hashed passwords. Here we do a simple string comparison.
        return user;
    },

    signup: async (data: SignUpDataWithPassword): Promise<DBUser> => {
        await delay(750); // Simulate network latency
        const existingUser = dbService.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error('An account with this email already exists.');
        }

        const newUser: DBUser = {
            id: `user_${Date.now()}`,
            name: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password, // Storing plain text password in this mock setup
            plan: 'Free', // All new signups start on the Free plan
            profilePhoto: data.profilePhoto,
            role: data.role,
            preferredLanguage: data.preferredLanguage,
        };
        
        dbService.saveUser(newUser);
        return newUser;
    },
    
    socialLogin: async (provider: 'google' | 'facebook'): Promise<DBUser> => {
        await delay(500);
        // This is a mock implementation. In a real app, this would involve OAuth flows.
        // We'll log in a pre-defined premium user for demonstration.
        const premiumUser = dbService.findUserByEmail('premium@example.com');
        if (!premiumUser) {
            throw new Error('Demo premium user not found.');
        }
        return premiumUser;
    }
};

export default authService;
