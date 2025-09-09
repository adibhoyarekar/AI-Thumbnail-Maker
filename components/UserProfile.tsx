import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();

    if (!isAuthenticated || !user) {
        // When not authenticated, the LoginPage is shown, so this component should render nothing.
        return null;
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-white font-semibold">{user.name}</p>
                    <p className={`text-xs ${user.plan === 'Premium' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {user.plan} Plan {user.plan === 'Premium' && '✨'}
                    </p>
                </div>
                 {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                        <svg className="h-full w-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </span>
                )}
                <button
                    onClick={logout}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfile;