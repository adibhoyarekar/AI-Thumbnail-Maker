import React, { useState } from 'react';
import { estimateCTRScore } from '../services/geminiService';
import type { CTRScoreResult } from '../types';
import Loader from './Loader';

const CTREstimator: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoTitle, setVideoTitle] = useState<string>('');
    const [result, setResult] = useState<CTRScoreResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null); // Reset result on new image
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imagePreview || !videoTitle) {
            setError("Please upload a thumbnail image and enter a video title.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const scoreResult = await estimateCTRScore(imagePreview, videoTitle);
            setResult(scoreResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="mt-16 w-full max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
                 <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
                        CTR Score Estimator
                    </h3>
                    <p className="text-md text-gray-400 max-w-2xl mx-auto mt-2">
                        Upload your thumbnail and title to get an AI-powered click-through rate prediction.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center justify-center">
                         <label htmlFor="thumbnail-upload" className="w-full aspect-video bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/70 transition-colors">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="text-center text-gray-400 p-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="mt-2 text-sm font-semibold">Click to upload thumbnail</p>
                                    <p className="text-xs">PNG, JPG, WEBP</p>
                                </div>
                            )}
                        </label>
                        <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-1">Video Title</label>
                             <input
                                type="text"
                                id="video-title"
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3 text-white"
                                placeholder="e.g., My Honest Review After 1 Week"
                                required
                              />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !imageFile || !videoTitle}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? 'Analyzing...' : 'Estimate Score'}
                        </button>
                    </div>
                </form>

                {isLoading && <div className="mt-6"><Loader /></div>}
                {error && (
                    <div className="mt-6 bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
                        <p>{error}</p>
                    </div>
                )}
                {result && (
                    <div className="mt-8 animate-fade-in">
                        <h4 className="text-lg font-semibold text-center text-gray-200">Analysis Result</h4>
                        <div className="mt-4 bg-gray-900/50 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-700">
                            <div className="flex-shrink-0 text-center">
                                <p className="text-gray-400 text-sm">Estimated CTR Score</p>
                                <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
                                    {result.score}<span className="text-3xl text-gray-500">/100</span>
                                </p>
                            </div>
                            <div className="border-l-2 border-gray-700 pl-6 w-full">
                                <p className="font-semibold text-gray-300">AI Feedback:</p>
                                <ul className="mt-2 list-disc list-inside space-y-2 text-gray-400">
                                    {result.feedback.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CTREstimator;
