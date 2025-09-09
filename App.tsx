import React, { useState } from 'react';
import { FormData, HistoryItem } from './types';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import ThumbnailGeneratorForm from './components/ThumbnailGeneratorForm';
import ThumbnailDisplay from './components/ThumbnailDisplay';
import SampleThumbnails from './components/SampleThumbnails';
import EditModal from './components/EditModal';
import PricingModal from './components/PricingModal';
import Dashboard from './components/Dashboard';
import BulkGeneratorModal from './components/BulkGeneratorModal';
import BrandKitForm from './components/BrandKitForm';
import CTREstimator from './components/CTREstimator';
import AboutPage from './components/AboutPage';
import LoginPage from './components/LoginPage';

import { 
  editThumbnail,
} from './services/geminiService';

type Page = 'main' | 'about';

const App: React.FC = () => {
    const { user, isAuthenticated, history, favorites, saveHistory, saveFavorites } = useAuth();
    
    if (!isAuthenticated) {
        return <LoginPage />;
    }
    
    const isPremium = user?.plan === 'Premium';
    
    const [currentPage, setCurrentPage] = useState<Page>('main');

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
    const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
    const [editError, setEditError] = useState<string | null>(null);

    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const handleGeneration = async (generationFn: () => Promise<string[]>, formData?: FormData) => {
        setIsLoading(true);
        setError(null);
        setImageUrls([]);
        try {
            const urls = await generationFn();
            setImageUrls(urls);
            if(urls.length > 0 && user && formData) {
              const newHistoryItem: HistoryItem = { 
                prompt: formData.prompt, 
                imageUrls: urls, 
                timestamp: new Date().toISOString() 
              };
              // Prepend new item and save the entire updated history
              const updatedHistory = [newHistoryItem, ...history].slice(0, 20);
              saveHistory(updatedHistory);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = async (data: FormData, originalImages: string[]) => {
      const { prompt, thumbnailText, style, language, audience, detailedPrompt } = data;
      const textInstruction = thumbnailText?.trim()
          ? `The thumbnail text MUST be: "${thumbnailText}". Make it prominent and easy to read.`
          : `Generate a short, catchy, high-CTR text overlay based on the video title.`;

      const basePrompt = `Task: Create a 16:9 YouTube thumbnail by combining subjects from all provided images into a single, cohesive scene.
- Video Title: "${prompt}"
- Detailed Instructions: "${detailedPrompt || 'The user did not provide detailed instructions, so be creative based on the title.'}"
- Art Style: "${style}"
- Core Task: Identify the main person/subject in each of the uploaded photos. Expertly cut them out, redraw them in the specified art style, and arrange them together naturally within a new, dynamic background that fits the video's theme and detailed instructions.
- Text: ${textInstruction}
- Language for Text: ${language}
- Target Audience: ${audience}
- Design Principles: Choose a color palette and font style that are emotionally resonant with the video's topic AND fit the '${style}' theme to maximize click-through rate.
- Final Output: A single, complete, polished thumbnail image featuring all subjects.`;

      const prompts = [
        `${basePrompt}\n- Design Variation: Create a version with a bright, high-contrast color scheme to make it pop.`,
        `${basePrompt}\n- Design Variation: Create a version with more dramatic, cinematic lighting for a moody feel.`,
        `${basePrompt}\n- Design Variation: Create a version with an alternative, creative text placement or a different, stylish font.`,
      ];

      await handleGeneration(async () => {
        const promises = prompts.map(p => editThumbnail(originalImages, p, isPremium));
        const results = await Promise.all(promises);
        return results.map(res => res.imageUrl).filter((url): url is string => !!url);
      }, data);
    };

    const handleEdit = (url: string) => {
      setEditImageUrl(url);
      setEditError(null);
    };

    const handleEditSubmit = async (prompt: string) => {
        if (!editImageUrl) return;
        setIsEditLoading(true);
        setEditError(null);
        try {
            const { imageUrl: newImageUrl } = await editThumbnail([editImageUrl], prompt, isPremium);
            if (newImageUrl) {
                // Update local display state
                const newUrls = imageUrls.map(url => url === editImageUrl ? newImageUrl : url);
                setImageUrls(newUrls);
                // Update history in the backend
                const updatedHistory = history.map(h => ({
                    ...h,
                    imageUrls: h.imageUrls.map(url => url === editImageUrl ? newImageUrl : url)
                }));
                saveHistory(updatedHistory);
                // Update favorites in the backend
                const updatedFavorites = favorites.map(url => url === editImageUrl ? newImageUrl : url);
                saveFavorites(updatedFavorites);

                setEditImageUrl(null);
            }
        } catch (err) {
            setEditError(err instanceof Error ? err.message : "An unknown error occurred during edit.");
        } finally {
            setIsEditLoading(false);
        }
    };
    
    const handleToggleFavorite = (url: string) => {
      const newFavorites = favorites.includes(url) 
        ? favorites.filter(fav => fav !== url) 
        : [...favorites, url];
      saveFavorites(newFavorites);
    };
    
    const handleOpenBulkModal = () => {
      if(isPremium) {
        setIsBulkModalOpen(true);
      } else {
        setIsPricingModalOpen(true);
      }
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <main className="container mx-auto px-4 py-8">
                <Header 
                  onUpgradeClick={() => setIsPricingModalOpen(true)}
                  onAboutClick={() => setCurrentPage('about')}
                />
                
                {currentPage === 'main' ? (
                  <>
                    <div className="text-center mt-8 mb-12 animate-fade-in">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                            Create Viral Thumbnails in Seconds
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                            Leverage the power of AI to design click-worthy thumbnails that grab attention and boost your views.
                            No design skills needed.
                        </p>
                        <button onClick={handleOpenBulkModal} className="mt-6 text-sm text-indigo-300 hover:text-indigo-200">
                           ⚡ Looking for bulk generation?
                        </button>
                    </div>

                    <ThumbnailGeneratorForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        onUpgradeClick={() => setIsPricingModalOpen(true)}
                    />
                    
                    <ThumbnailDisplay
                        imageUrls={imageUrls}
                        isLoading={isLoading}
                        error={error}
                        onEdit={handleEdit}
                        onToggleFavorite={handleToggleFavorite}
                        favorites={favorites}
                    />
                    
                    {isAuthenticated && <Dashboard history={history} favorites={favorites} onToggleFavorite={handleToggleFavorite} />}

                    {isAuthenticated && isPremium && <BrandKitForm />}
                    
                    {isAuthenticated && isPremium && <CTREstimator />}

                    <SampleThumbnails />
                  </>
                ) : (
                  <AboutPage onBack={() => setCurrentPage('main')} />
                )}

            </main>

            <EditModal
                isOpen={!!editImageUrl}
                onClose={() => setEditImageUrl(null)}
                onSubmit={handleEditSubmit}
                imageUrl={editImageUrl || ''}
                isLoading={isEditLoading}
                error={editError}
            />

            <PricingModal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
            />
            
            <BulkGeneratorModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
            />

            <footer className="text-center py-8 mt-12 border-t border-gray-800">
              <p className="text-gray-500 text-sm">&copy; 2025 Thumbnail AI. Powered by adibhoyarekar.</p>
            </footer>
        </div>
    );
};

export default App;
