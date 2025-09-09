import React, { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSubmit, imageUrl, isLoading, error }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-2xl mx-4 p-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-indigo-400">Edit Thumbnail</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
                <img src={imageUrl} alt="Thumbnail to edit" className="rounded-lg w-full sm:w-64 aspect-video object-cover border-2 border-gray-700" />
            </div>
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300">
                        Describe your changes
                    </label>
                    <textarea
                        id="edit-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-32 p-3 resize-y"
                        placeholder="e.g., Change the text to 'NEW UPDATE!', make the background a dark galaxy, add a glowing effect to the text."
                        required
                    />
                </div>
                 {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

                <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Applying...' : 'Apply Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;