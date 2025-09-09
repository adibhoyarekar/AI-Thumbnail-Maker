import type { User, BrandKit, HistoryItem } from '../types';

// The user type stored in our mock DB will include the password
export interface DBUser extends User {
    password?: string;
}

const DB_KEY = 'thumbnail_ai_database';

interface Database {
    users: Record<string, DBUser>;
    history: Record<string, HistoryItem[]>;
    favorites: Record<string, string[]>;
    brandKits: Record<string, BrandKit>;
}

const getDB = (): Database => {
    try {
        const dbString = localStorage.getItem(DB_KEY);
        if (dbString) {
            return JSON.parse(dbString);
        }
    } catch (error) {
        console.error("Failed to parse database from localStorage", error);
    }
    // Return a default, empty database structure if one doesn't exist
    return { users: {}, history: {}, favorites: {}, brandKits: {} };
};

const saveDB = (db: Database) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const seedInitialData = () => {
    const db = getDB();
    // Seed a premium user for the social login demo if they don't exist
    const premiumUserEmail = 'premium@example.com';
    const userExists = Object.values(db.users).some(u => u.email === premiumUserEmail);
    if (!userExists) {
        const premiumUser: DBUser = {
            id: 'premium_user_1',
            name: 'Demo Premium User',
            username: 'premium_user',
            email: premiumUserEmail,
            password: 'Password1!', // Set a default password for demo purposes
            plan: 'Premium',
            profilePhoto: 'https://i.pravatar.cc/150?u=premium',
        };
        db.users[premiumUser.id] = premiumUser;
        saveDB(db);
    }
};

// Initialize DB with seed data on load
seedInitialData();

export const dbService = {
    // User operations
    findUserByEmail: (email: string): DBUser | undefined => {
        const db = getDB();
        return Object.values(db.users).find(user => user.email === email);
    },
    findUserById: (userId: string): DBUser | undefined => {
        const db = getDB();
        return db.users[userId];
    },
    saveUser: (user: DBUser): void => {
        const db = getDB();
        db.users[user.id] = user;
        saveDB(db);
    },

    // History operations
    getHistory: (userId: string): HistoryItem[] => {
        const db = getDB();
        return db.history[userId] || [];
    },
    saveHistory: (userId: string, history: HistoryItem[]): void => {
        const db = getDB();
        db.history[userId] = history;
        saveDB(db);
    },

    // Favorites operations
    getFavorites: (userId: string): string[] => {
        const db = getDB();
        return db.favorites[userId] || [];
    },
    saveFavorites: (userId: string, favorites: string[]): void => {
        const db = getDB();
        db.favorites[userId] = favorites;
        saveDB(db);
    },

    // Brand Kit operations
    getBrandKit: (userId: string): BrandKit | null => {
        const db = getDB();
        return db.brandKits[userId] || null;
    },
    saveBrandKit: (userId: string, kit: BrandKit): void => {
        const db = getDB();
        db.brandKits[userId] = kit;
        saveDB(db);
    }
};
