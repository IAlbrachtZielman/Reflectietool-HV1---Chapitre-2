
import React, { useState } from 'react';
import { REFLECTION_QUESTIONS } from '../constants';
import { ReflectionAnswers } from '../types';

interface ReflectionPhaseProps {
  onReflectionComplete: (answers: ReflectionAnswers) => void;
}

const ReflectionPhase: React.FC<ReflectionPhaseProps> = ({ onReflectionComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ReflectionAnswers>({});

  const currentQuestion = REFLECTION_QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  const handleNext = () => {
    if (currentQuestionIndex < REFLECTION_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onReflectionComplete(answers);
    }
  };

  const handleSingleChoiceChange = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleMultiChoiceChange = (option: string) => {
    const currentSelection = (answers[currentQuestion.id] as string[] | undefined) || [];
    const newSelection = currentSelection.includes(option)
      ? currentSelection.filter((item) => item !== option)
      : [...currentSelection, option];
    setAnswers({ ...answers, [currentQuestion.id]: newSelection });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const isAnswered = (): boolean => {
    if (!currentAnswer) return false;
    if (Array.isArray(currentAnswer) && currentAnswer.length === 0) return false;
    if (typeof currentAnswer === 'string' && currentAnswer.trim() === '') return false;
    return true;
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'single-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  currentAnswer === option
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'bg-white border-slate-300 hover:border-blue-400'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={() => handleSingleChoiceChange(option)}
                  className="h-5 w-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="ml-4 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  (currentAnswer as string[])?.includes(option)
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'bg-white border-slate-300 hover:border-blue-400'
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={(currentAnswer as string[])?.includes(option) || false}
                  onChange={() => handleMultiChoiceChange(option)}
                  className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="ml-4 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'short-text':
        return (
          <input
            type="text"
            value={(currentAnswer as string) || ''}
            onChange={handleTextChange}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Typ hier je antwoord (max. 1 zin)"
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentQuestionIndex + 1) / REFLECTION_QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col">
        <div className="mb-6">
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <p className="text-right text-sm text-slate-500 mt-1">Vraag {currentQuestionIndex + 1} van {REFLECTION_QUESTIONS.length}</p>
        </div>

      <h2 className="text-2xl font-semibold text-slate-800 mb-2">{currentQuestion.question}</h2>
      {currentQuestion.subtitle && <p className="text-slate-500 mb-6">{currentQuestion.subtitle}</p>}
      
      <div className="mt-4 mb-8 min-h-[150px]">{renderInput()}</div>

      <div className="mt-auto pt-4 border-t border-slate-200 flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isAnswered()}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {currentQuestionIndex < REFLECTION_QUESTIONS.length - 1 ? 'Volgende' : 'Klaar!'}
        </button>
      </div>
    </div>
  );
};

export default ReflectionPhase;
