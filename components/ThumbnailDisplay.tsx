import React from 'react';
import Loader from './Loader';

interface ThumbnailDisplayProps {
  imageUrls: string[];
  isLoading: boolean;
  error: string | null;
  onEdit: (url: string) => void;
  onToggleFavorite: (url: string) => void;
  favorites: string[];
}

const ThumbnailDisplay: React.FC<ThumbnailDisplayProps> = ({ 
  imageUrls, 
  isLoading, 
  error, 
  onEdit,
  onToggleFavorite,
  favorites
}) => {

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="mt-12 w-full max-w-4xl mx-auto flex justify-center items-center p-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 w-full max-w-4xl mx-auto bg-red-900/20 border border-red-500 text-red-300 p-6 rounded-lg text-center">
        <h3 className="font-bold">Generation Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 w-full max-w-6xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Your Generated Thumbnails</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageUrls.map((url, index) => (
          <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg border-2 border-transparent hover:border-indigo-500 transition-all">
            <img src={url} alt={`Generated thumbnail ${index + 1}`} className="w-full h-auto aspect-video object-cover" />
            
            <div 
              className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold py-1 px-2 rounded-full cursor-help"
              title="Coming Soon!"
            >
              CTR Prediction ✨
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-3">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-3">
                <button onClick={() => onEdit(url)} title="Edit" className="p-3 bg-gray-800/80 rounded-full text-white hover:bg-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
                <button onClick={() => handleDownload(url)} title="Download" className="p-3 bg-gray-800/80 rounded-full text-white hover:bg-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
                <button 
                  onClick={() => onToggleFavorite(url)} 
                  title={favorites.includes(url) ? "Unfavorite" : "Favorite"}
                  className={`p-3 bg-gray-800/80 rounded-full text-white hover:bg-pink-600 ${favorites.includes(url) ? 'text-pink-500' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ThumbnailDisplay;