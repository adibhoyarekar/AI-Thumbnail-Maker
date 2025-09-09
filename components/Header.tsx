import React from 'react';
import UserProfile from './UserProfile';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onUpgradeClick: () => void;
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUpgradeClick, onAboutClick }) => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-red-600" viewBox="0 0 28 20" fill="currentColor">
                    <path d="M27.323 3.107A3.523 3.523 0 0 0 24.84 .624C22.665 0 14 0 14 0S5.335 0 3.16.624A3.523 3.523 0 0 0 .677 3.107C0 5.282 0 10 0 10s0 4.718.677 6.893a3.523 3.523 0 0 0 2.483 2.483C5.335 20 14 20 14 20s8.665 0 10.84-.624a3.523 3.523 0 0 0 2.483-2.483C28 14.718 28 10 28 10s0-4.718-.677-6.893zM11.2 14V6l6.8 4-6.8 4z"/>
                </svg>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                    Thumbnail AI
                </h1>
            </div>
             <button
                onClick={onAboutClick}
                className="text-gray-400 hover:text-white transition-colors font-medium text-sm"
              >
                About
              </button>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && user?.plan === 'Free' && (
            <button
              onClick={onUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg"
            >
              ✨ Upgrade
            </button>
          )}
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;