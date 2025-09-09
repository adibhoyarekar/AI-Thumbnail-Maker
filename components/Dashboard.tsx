import React, { useState } from 'react';
import type { HistoryItem } from '../types';

interface DashboardProps {
    history: HistoryItem[];
    favorites: string[];
    onToggleFavorite: (imageUrl: string) => void;
}

type Tab = 'History' | 'Favorites';

const Dashboard: React.FC<DashboardProps> = ({ history, favorites, onToggleFavorite }) => {
    const [activeTab, setActiveTab] = useState<Tab>('History');

    const renderEmptyState = (message: string) => (
        <div className="text-center text-gray-400 py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 font-semibold">{message}</p>
        </div>
    );

    const renderGrid = (items: string[]) => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((url, index) => (
                <div key={index} className="group relative aspect-video">
                    <img src={url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover rounded-lg border-2 border-gray-700" />
                    <div className="absolute top-2 right-2 flex items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                        <button
                            onClick={() => onToggleFavorite(url)}
                            title={favorites.includes(url) ? "Remove from Favorites" : "Add to Favorites"}
                            className={`inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white ${favorites.includes(url) ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-600 hover:bg-pink-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                My Dashboard
            </h2>
            <div className="w-full max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
                <div className="border-b border-gray-600">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('History')}
                            className={`${activeTab === 'History' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab('Favorites')}
                            className={`${activeTab === 'Favorites' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Favorites
                        </button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'History' && (
                        history.length > 0 ? renderGrid(history.flatMap(h => h.imageUrls)) : renderEmptyState("Your generation history will appear here.")
                    )}
                    {activeTab === 'Favorites' && (
                        favorites.length > 0 ? renderGrid(favorites) : renderEmptyState("Your favorite thumbnails will appear here.")
                    )}
                </div>
            </div>
        </section>
    );
};

export default Dashboard;