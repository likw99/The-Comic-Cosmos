import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import type { ComicData, ComicPanel } from './types';
import { QueryForm } from './components/QueryForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ComicDisplay } from './components/ComicDisplay';
import { identifyExpert, generateStoryAndScript, generateComicImage } from './services/geminiService';

const KIDS_LEARNING_LEVEL = 'for a curious 8-year-old kid';

interface Expert {
    name: string;
    description: string;
}

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.Idle);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    
    const [question, setQuestion] = useState<string>('Explain the theory of relativity');
    const [comicData, setComicData] = useState<ComicData | null>(null);
    const [expert, setExpert] = useState<Expert | null>(null);

    const handleReset = () => {
        setAppState(AppState.Idle);
        setError(null);
        setQuestion('');
        setComicData(null);
        setLoadingMessage('');
        setExpert(null);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setAppState(AppState.Loading);
        setError(null);
        
        try {
            setLoadingMessage('Finding the perfect expert guide...');
            const identifiedExpert = await identifyExpert(question);
            setExpert(identifiedExpert);

            setLoadingMessage(`Crafting your story with ${identifiedExpert.name}...`);
            const script = await generateStoryAndScript(question, KIDS_LEARNING_LEVEL, identifiedExpert.name);
            setComicData(script);

            const imagePromises: Promise<ComicPanel>[] = script.panels.map(async (panel, index) => {
                setLoadingMessage(`Drawing panel ${index + 1} of ${script.panels.length}...`);
                const imageUrl = await generateComicImage(panel.description, KIDS_LEARNING_LEVEL, identifiedExpert.description);
                const updatedPanel = { ...panel, imageUrl };
                
                setComicData(prevData => {
                    if (!prevData) return null;
                    const newPanels = [...prevData.panels];
                    newPanels[index] = updatedPanel;
                    return { ...prevData, panels: newPanels };
                });
                
                return updatedPanel;
            });

            await Promise.all(imagePromises);
            
            setLoadingMessage('Finalizing your comic!');
            setAppState(AppState.Success);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            setAppState(AppState.Error);
        }
    }, [question]);

    const renderContent = () => {
        switch (appState) {
            case AppState.Loading:
                return comicData 
                    ? <ComicDisplay comic={comicData} onReset={handleReset} />
                    : <LoadingScreen message={loadingMessage} />;
            case AppState.Success:
                return comicData ? <ComicDisplay comic={comicData} onReset={handleReset} /> : null;
            case AppState.Error:
                return (
                    <div className="text-center p-8 max-w-md mx-auto">
                         <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200">
                            <h2 className="text-2xl font-bold text-red-600">Something Went Wrong</h2>
                            <p className="text-slate-600 mt-2">{error}</p>
                            <button onClick={handleReset} className="mt-6 bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700">
                                Try Again
                            </button>
                        </div>
                    </div>
                );
            case AppState.Idle:
            default:
                return (
                    <QueryForm
                        question={question}
                        setQuestion={setQuestion}
                        onSubmit={handleSubmit}
                        isLoading={false}
                    />
                );
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 font-sans">
           {renderContent()}
        </div>
    );
};

export default App;