
import React, { useState, useEffect } from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

const LOADING_MESSAGES = [
    'Consulting with cosmic cartographers...',
    'Sketching out scientific scenes...',
    'Inking the panels of knowledge...',
    'Coloring in the details of the universe...',
    'Polishing the final frames...',
    'Binding the comic pages together...',
];

interface LoadingScreenProps {
  message: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
    const [dynamicMessage, setDynamicMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % LOADING_MESSAGES.length;
            setDynamicMessage(LOADING_MESSAGES[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-screen">
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-slate-200">
                <SpinnerIcon className="w-12 h-12 text-sky-500 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800 mt-6">{message}</h2>
                <p className="text-slate-500 mt-2 transition-opacity duration-500">{dynamicMessage}</p>
            </div>
        </div>
    );
};
