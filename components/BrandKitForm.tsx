import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { BrandKit } from '../types';

const BrandKitForm: React.FC = () => {
    const { brandKit, saveBrandKit } = useAuth();
    const [formData, setFormData] = useState<BrandKit>({
        brandName: '',
        slogan: '',
        primaryColor: '#ffffff',
        secondaryColor: '#000000',
        fontPreference: '',
    });
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (brandKit) {
            setFormData(brandKit);
        }
    }, [brandKit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await saveBrandKit(formData);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error("Failed to save brand kit", error);
            // In a real app, you would show an error message to the user here.
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="mt-16 w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
                 <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-500">
                        My Brand Kit
                    </h3>
                    <p className="text-md text-gray-400 max-w-2xl mx-auto mt-2">
                        Save your brand details here. The AI will use them to keep your thumbnails consistent.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="brandName" className="block text-sm font-medium text-gray-300">Brand Name</label>
                            <input type="text" name="brandName" id="brandName" value={formData.brandName} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white" placeholder="e.g., Pixel Pioneers" required />
                        </div>
                         <div>
                            <label htmlFor="slogan" className="block text-sm font-medium text-gray-300">Slogan (Optional)</label>
                            <input type="text" name="slogan" id="slogan" value={formData.slogan} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white" placeholder="e.g., Next level gaming." />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-300">Primary Color</label>
                                <input type="color" name="primaryColor" id="primaryColor" value={formData.primaryColor} onChange={handleChange} className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-300">Secondary Color</label>
                                <input type="color" name="secondaryColor" id="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className="mt-1 block w-full h-12 bg-gray-700 border-gray-600 rounded-md shadow-sm" />
                            </div>
                         </div>
                        <div>
                            <label htmlFor="fontPreference" className="block text-sm font-medium text-gray-300">Font Preference</label>
                            <input type="text" name="fontPreference" id="fontPreference" value={formData.fontPreference} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-3 text-white" placeholder="e.g., Bold and futuristic sans-serif" required/>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Saving...' : (isSaved ? 'Saved!' : 'Save Brand Kit')}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default BrandKitForm;