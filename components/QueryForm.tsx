import React from 'react';

interface QueryFormProps {
  question: string;
  setQuestion: (question: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const QUICK_START_QUESTIONS = [
  'Why do we have gravity?',
  'What is E=mc²?',
  'How do computers "think"?',
  'What is game theory?',
  'What is radioactivity?',
  'How does photosynthesis work?',
];

export const QueryForm: React.FC<QueryFormProps> = ({ 
  question, 
  setQuestion, 
  onSubmit, 
  isLoading,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-display text-slate-800">
          The Comic <span className="text-sky-500">Cosmos</span>
        </h1>
        <p className="mt-4 text-2xl font-display text-slate-700 max-w-xl mx-auto">
          Understand the cosmos <span className="text-sky-500">with comics</span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="mb-6">
          <label htmlFor="question" className="block text-sm font-bold text-slate-700 mb-2">
            What do you want to learn about?
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How does photosynthesis work?"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none"
            rows={3}
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-8">
          <span className="block text-sm font-bold text-slate-700 mb-2">
            Or try one of these...
          </span>
           <div className="flex flex-wrap gap-2">
              {QUICK_START_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestion(q)}
                  className="bg-white text-sky-600 border border-sky-300 text-sm px-3 py-1 rounded-full hover:bg-sky-50 transition duration-200"
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
           </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !question}
          className="w-full bg-slate-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {isLoading ? 'Creating...' : 'Create My Comic'}
        </button>
      </form>
    </div>
  );
};