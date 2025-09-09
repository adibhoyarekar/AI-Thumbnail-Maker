import React, { useState, useEffect } from 'react';
import { FormData, ThumbnailStyle, Language, TextTone, TextStyle } from '../types';
import { PREMIUM_THUMBNAIL_STYLES, TEXT_TONES, TEXT_STYLES, THUMBNAIL_STYLES, LANGUAGES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { suggestCatchphrases } from '../services/geminiService';
import ImageCropModal from './ImageCropModal';

interface UploadedImage {
    raw: string;
    cropped: string | null;
}
interface ThumbnailGeneratorFormProps {
  onSubmit: (data: FormData, originalImages: string[]) => void;
  isLoading: boolean;
  onUpgradeClick: () => void;
}

type Step = 'upload' | 'customize';

const ThumbnailGeneratorForm: React.FC<ThumbnailGeneratorFormProps> = ({ onSubmit, isLoading, onUpgradeClick }) => {
  const { user } = useAuth();
  const isPremium = user?.plan === 'Premium';

  const [step, setStep] = useState<Step>('upload');
  
  // Upload flow state
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [croppingImageIndex, setCroppingImageIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
 
  // Common state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    thumbnailText: '',
    style: ThumbnailStyle.Default,
    language: Language.English,
    audience: 'General Audience',
    textTone: TextTone.Default,
    textStyle: TextStyle.Default,
    detailedPrompt: '',
  });
  
  // Debounced effect for auto-suggestions
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only trigger if we are in a customization step
      if (step === 'customize' && formData.prompt.trim().length > 10) {
        handleSuggest();
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [formData.prompt, formData.audience, formData.textTone, formData.textStyle, step]);
  
  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestionError(null);
    setSuggestions([]);
    try {
        const phrases = await suggestCatchphrases(
            formData.prompt, 
            formData.audience, 
            formData.textTone,
            formData.textStyle,
            isPremium
        );
        setSuggestions(phrases);
    } catch (err) {
        setSuggestionError(err instanceof Error ? err.message : "Failed to get suggestions.");
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadedImages.length >= 4) return;

    setUploadError(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const newImage = { raw: reader.result as string, cropped: null };
      setUploadedImages(prev => [...prev, newImage]);
      // Immediately open crop modal for the new image
      setCroppingImageIndex(uploadedImages.length);
    };
    reader.onerror = () => setUploadError('Failed to read file.');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleCropComplete = (croppedImageUrl: string, index: number) => {
    setUploadedImages(prev => prev.map((img, i) => i === index ? { ...img, cropped: croppedImageUrl } : img));
    setCroppingImageIndex(null);
  };
  
  const handleProceedToCustomize = () => {
      // Set default cropped images for any that weren't manually cropped
      const allCropped = uploadedImages.map(img => ({
          ...img,
          cropped: img.cropped ?? img.raw
      }));
      setUploadedImages(allCropped);
      setStep('customize');
  }

  const handleStartOver = () => {
    setStep('upload');
    setUploadedImages([]);
    setCroppingImageIndex(null);
    setUploadError(null);
    setFormData({
        prompt: '', thumbnailText: '', style: ThumbnailStyle.Default, language: Language.English,
        audience: 'General Audience', textTone: TextTone.Default, textStyle: TextStyle.Default, detailedPrompt: '',
    });
    setSuggestions([]);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'style') {
        const selectedStyle = value as ThumbnailStyle;
        const isPremiumStyle = PREMIUM_THUMBNAIL_STYLES.includes(selectedStyle);
        if (isPremiumStyle && !isPremium) {
            onUpgradeClick();
            return;
        }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = uploadedImages.map(img => img.cropped!).filter(Boolean);
    if (finalImages.length > 0) {
        onSubmit(formData, finalImages);
    }
  };

  const renderUploadStep = () => (
     <section className="w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 animate-fade-in">
        <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-indigo-300">Upload Your Photos</h3>
            <p className="text-gray-400 mt-2">Add up to 4 images. The AI will cut out the main subjects and combine them into a new scene for you. You can crop each one after uploading.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => {
                const image = uploadedImages[index];
                if (image) {
                    return (
                        <div key={index} className="relative aspect-video group">
                           <img src={image.cropped || image.raw} alt={`upload preview ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-indigo-500" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                <button onClick={() => setCroppingImageIndex(index)} title="Crop" className="p-2 bg-gray-800/80 rounded-full text-white hover:bg-indigo-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 10a1 1 0 01-1-1H2a1 1 0 010-2h1a1 1 0 011 1zm0 0a1 1 0 001 1v1a1 1 0 00-2 0v-1a1 1 0 001-1zm12 0a1 1 0 00-1-1h-1a1 1 0 100 2h1a1 1 0 001-1zm-1 5a1 1 0 01-1 1v1a1 1 0 11-2 0v-1a1 1 0 01-1-1h-1a1 1 0 110-2h1a1 1 0 011 1zm0 0a1 1 0 001-1h1a1 1 0 100-2h-1a1 1 0 00-1 1zm-6-5a3 3 0 100 6 3 3 0 000-6z" /></svg>
                                </button>
                                <button onClick={() => handleRemoveImage(index)} title="Remove" className="p-2 bg-gray-800/80 rounded-full text-white hover:bg-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                           </div>
                        </div>
                    );
                }
                if (index === uploadedImages.length) {
                    return (
                         <label key="uploader" htmlFor="multi-upload" className="aspect-video w-full bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/70 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span className="mt-1 text-xs text-gray-400">Add Image</span>
                        </label>
                    );
                }
                return <div key={index} className="aspect-video w-full bg-gray-800/50 rounded-lg"></div>
            })}
        </div>
        <input id="multi-upload" type="file" accept="image/*" capture="user" className="hidden" onChange={handleFileChange} disabled={uploadedImages.length >= 4} />
        {uploadError && <p className="mt-4 text-sm text-red-400 text-center">{uploadError}</p>}

        <div className="mt-8 flex justify-end">
            <button onClick={handleProceedToCustomize} disabled={uploadedImages.length === 0} className="py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                Next &rarr;
            </button>
        </div>
    </section>
  );

  const renderCustomizationForm = () => {
    return (
      <section className="w-full max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-indigo-300">Describe Your Thumbnail</h3>
          <div>
            <button onClick={() => setStep('upload')} className="text-sm text-gray-400 hover:text-white mr-4">Back</button>
            <button onClick={handleStartOver} className="text-sm text-gray-400 hover:text-white">Start Over</button>
          </div>
        </div>
        <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                 <div>
                  <label htmlFor="prompt" className="block text-lg font-medium text-indigo-300">Video Title</label>
                  <input type="text" name="prompt" id="prompt" value={formData.prompt} onChange={handleChange} className="mt-2 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg p-3 text-white" placeholder="e.g., My Epic Gaming Adventure" required />
                </div>
                
                 <div>
                    <label htmlFor="detailedPrompt" className="block text-sm font-medium text-gray-300">Detailed Prompt</label>
                    <textarea name="detailedPrompt" id="detailedPrompt" value={formData.detailedPrompt} onChange={handleChange} rows={4} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white resize-y" placeholder="e.g., Place us in a futuristic gaming room with neon lights. Make the mood exciting." />
                </div>

                 <div>
                    <label htmlFor="audience" className="block text-sm font-medium text-gray-300">Target Audience</label>
                    <input type="text" name="audience" id="audience" value={formData.audience} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2 text-white" placeholder="e.g., Gamers, Beginner Cooks" />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-300">Art Style</label>
                        <select id="style" name="style" value={formData.style} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {THUMBNAIL_STYLES.map(style => {
                                const isPremiumStyle = PREMIUM_THUMBNAIL_STYLES.includes(style);
                                return (<option key={style} value={style} disabled={isPremiumStyle && !isPremium}>{style}{isPremiumStyle ? ' ✨' : ''}</option>);
                            })}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language for Text</label>
                        <select id="language" name="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {LANGUAGES.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
                        </select>
                    </div>
                </div>
              </div>
              <div>
                 <div className="mb-4">
                    <p className="text-center text-sm text-gray-400 mb-2">Your Uploaded Photos</p>
                    <div className="grid grid-cols-2 gap-2 bg-gray-700/50 rounded-lg p-2">
                       {uploadedImages.map((img, index) => (
                           <div key={index} className="aspect-video">
                               <img src={img.cropped || img.raw} alt={`Uploaded ${index}`} className="w-full h-full object-cover rounded-md"/>
                           </div>
                       ))}
                    </div>
                 </div>
                 <div>
                  <label htmlFor="thumbnailText" className="block text-sm font-medium text-gray-300">Text on Thumbnail (Optional)</label>
                   <input type="text" name="thumbnailText" id="thumbnailText" value={formData.thumbnailText} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="AI will suggest text here, or type your own" />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 relative">
                      {!isPremium && <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-md cursor-pointer border border-gray-700" onClick={onUpgradeClick}>
                        <div className="text-center p-2"><p className="font-bold text-yellow-400">✨ Upgrade to Premium</p><p className="text-xs text-gray-300">to unlock advanced text controls.</p></div>
                      </div>}
                      <div>
                        <label htmlFor="textTone" className="block text-xs font-medium text-gray-400">Tone</label>
                        <select id="textTone" name="textTone" value={formData.textTone} onChange={handleChange} disabled={!isPremium} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:opacity-50">
                          {TEXT_TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                        </select>
                      </div>
                      <div>
                          <label htmlFor="textStyle" className="block text-xs font-medium text-gray-400">Style</label>
                          <select id="textStyle" name="textStyle" value={formData.textStyle} onChange={handleChange} disabled={!isPremium} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:opacity-50">
                              {TEXT_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                          </select>
                      </div>
                    </div>

                    {isSuggesting && <p className="mt-2 text-xs text-gray-400">AI is brainstorming text ideas...</p>}
                    {suggestionError && <p className="mt-2 text-xs text-red-400">{suggestionError}</p>}
                    {suggestions.length > 0 && (
                        <div className="mt-3"><p className="text-xs text-gray-400 mb-2">Click a suggestion to use it:</p><div className="flex flex-wrap gap-2">
                            {suggestions.map((s, i) => (
                                <button key={i} type="button" onClick={() => setFormData(prev => ({ ...prev, thumbnailText: s }))} className="text-left text-sm p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all truncate" title={s}>{s}</button>
                            ))}
                        </div></div>
                    )}
                 </div>
              </div>
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                {isLoading ? 'Generating...' : `✨ Create My Thumbnail`}
              </button>
            </div>
        </form>
      </section>
    );
  }

  const renderContent = () => {
    switch (step) {
        case 'upload':
            return renderUploadStep();
        case 'customize':
            return renderCustomizationForm();
        default:
            return renderUploadStep();
    }
  };

  return (
    <>
      {renderContent()}
      <ImageCropModal
        isOpen={croppingImageIndex !== null}
        onClose={() => setCroppingImageIndex(null)}
        imageSrc={croppingImageIndex !== null ? uploadedImages[croppingImageIndex]?.raw : null}
        onCropComplete={handleCropComplete}
        imageIndex={croppingImageIndex!}
      />
    </>
  );
};

export default ThumbnailGeneratorForm;