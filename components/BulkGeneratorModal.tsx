import React, { useState } from 'react';
import { batchSuggestCatchphrases } from '../services/geminiService';
import type { BulkResult, BulkInputItem } from '../types';
import Loader from './Loader';

interface BulkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkGeneratorModal: React.FC<BulkGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setResults([]);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a CSV file first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        if (lines.length <= 1) { // Header + data
          throw new Error("CSV file must contain a header and at least one row of data.");
        }

        // Assumes header is present and skips it
        const dataRows = lines.slice(1);

        const itemsToProcess: BulkInputItem[] = dataRows.map(row => {
          // Simple CSV parse: assumes title,style and no commas in title
          const parts = row.split(',');
          const title = parts[0]?.trim();
          const style = parts[1]?.trim();
          if (!title || !style) {
            return null;
          }
          return { title, style };
        }).filter((item): item is BulkInputItem => item !== null);

        if (itemsToProcess.length === 0) {
          throw new Error("No valid 'title,style' rows found in the CSV. Please check the file format.");
        }
        
        const generatedResults = await batchSuggestCatchphrases(itemsToProcess);
        setResults(generatedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred during processing.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
    }
    reader.readAsText(file);
  };
  
  const handleDownloadCsv = () => {
    if (results.length === 0) return;
    
    const headers = "Video Title,Style,Suggested Text\n";
    const csvContent = results.map(r => 
      `"${r.title.replace(/"/g, '""')}","${r.style.replace(/"/g, '""')}","${r.suggestion.replace(/"/g, '""')}"`
    ).join('\n');
    
    const csv = headers + csvContent;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'thumbnail_suggestions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setFile(null);
    setResults([]);
    setError(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={handleClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl h-[90vh] mx-4 p-8 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-indigo-400">Bulk Caption Generator</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-gray-400 mt-1">Upload a CSV of video titles and styles to get AI-powered text suggestions for your thumbnails.</p>
        
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-start">
            <div className="flex-grow">
                <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-300 mb-2">Upload CSV File</label>
                <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-300 hover:file:bg-indigo-600/40"
                />
                <p className="text-xs text-gray-500 mt-1">CSV should contain two columns (with a header): 'title' and 'style'.</p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !file}
              className="w-full md:w-auto mt-4 md:mt-0 flex-shrink-0 flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : 'Generate Suggestions'}
            </button>
        </div>
        
        <div className="mt-6 flex-grow bg-gray-900/50 rounded-lg border border-gray-700 overflow-y-auto relative">
          {isLoading && <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center"><Loader /></div>}
          {error && <div className="p-4 text-center text-red-400">{error}</div>}
          {!isLoading && !error && results.length === 0 && (
            <div className="text-center text-gray-500 p-8">
              <p>Your results will appear here after generation.</p>
            </div>
          )}
          
          {results.length > 0 && (
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3">Video Title</th>
                  <th scope="col" className="px-6 py-3">Style</th>
                  <th scope="col" className="px-6 py-3">Suggested Text</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="px-6 py-4">{result.title}</td>
                    <td className="px-6 py-4"><span className="bg-gray-600 text-gray-200 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{result.style}</span></td>
                    <td className="px-6 py-4 font-medium text-indigo-300">{result.suggestion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
            <button
                type="button"
                onClick={handleClose}
                className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600"
            >
                Close
            </button>
            <button
                type="button"
                onClick={handleDownloadCsv}
                disabled={results.length === 0}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed"
            >
                Download Results
            </button>
        </div>
      </div>
    </div>
  );
};

export default BulkGeneratorModal;