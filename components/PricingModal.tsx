import React from 'react';
import { useAuth } from '../context/AuthContext';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const { upgradePlan } = useAuth();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        upgradePlan();
        onClose();
    };
    
    const Feature: React.FC<{ children: React.ReactNode; included: boolean }> = ({ children, included }) => (
        <li className="flex items-center gap-3">
            <span className={included ? "text-green-500" : "text-red-500"}>
                {included ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                ) : (
                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
            </span>
            <span className="text-gray-300">{children}</span>
        </li>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-lg mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="p-8 text-center">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                        Go Premium
                    </h2>
                    <p className="mt-4 text-gray-400">
                        Unlock all features and create unlimited, high-quality thumbnails without watermarks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-gray-900/50">
                    <div>
                        <h3 className="font-bold text-lg text-gray-400">Free</h3>
                        <ul className="mt-4 space-y-3">
                            <Feature included={true}>AI Thumbnail Generation</Feature>
                            <Feature included={false}>Unlimited Generations</Feature>
                            <Feature included={false}>No Watermark</Feature>
                            <Feature included={false}>4K Quality Downloads</Feature>
                        </ul>
                    </div>
                    <div className="border-2 border-yellow-500 rounded-lg p-6 bg-gray-800">
                         <h3 className="font-bold text-lg text-yellow-400">Premium</h3>
                         <ul className="mt-4 space-y-3">
                            <Feature included={true}>AI Thumbnail Generation</Feature>
                            <Feature included={true}>Unlimited Generations</Feature>
                            <Feature included={true}>No Watermark</Feature>
                            <Feature included={true}>4K Quality Downloads</Feature>
                        </ul>
                    </div>
                </div>

                <div className="p-8">
                     <button
                        onClick={handleUpgrade}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors text-lg shadow-lg transform hover:scale-105"
                    >
                        Subscribe Now (Demo)
                    </button>
                     <button
                        onClick={onClose}
                        className="w-full mt-4 text-gray-400 hover:text-white text-sm"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingModal;