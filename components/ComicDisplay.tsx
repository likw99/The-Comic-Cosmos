
import React from 'react';
import type { ComicData } from '../types';

interface ComicDisplayProps {
  comic: ComicData;
  onReset: () => void;
}

const Panel: React.FC<{ panel: ComicData['panels'][0] }> = ({ panel }) => (
    <div className="bg-white border-2 border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-md">
        <div className="aspect-square bg-slate-100 flex items-center justify-center">
            {panel.imageUrl ? (
                <img src={panel.imageUrl} alt={panel.description} className="w-full h-full object-cover" />
            ) : (
                <div className="p-4 text-center text-slate-500">Generating image...</div>
            )}
        </div>
        <div className="p-4 flex-grow bg-slate-800 text-white">
            <p className="text-sm">{panel.narration}</p>
        </div>
    </div>
);

export const ComicDisplay: React.FC<ComicDisplayProps> = ({ comic, onReset }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-display text-slate-800">{comic.title}</h1>
      </header>
      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {comic.panels.map((panel) => (
          <Panel key={panel.scene} panel={panel} />
        ))}
      </main>

      <footer className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-display text-sky-500 mb-4">What You've Learned</h2>
        <p className="text-slate-700 leading-relaxed">{comic.summary}</p>
        <button
          onClick={onReset}
          className="mt-6 bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-200"
        >
          Ask Another Question
        </button>
      </footer>
    </div>
  );
};
