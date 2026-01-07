
import React, { useState, useMemo } from 'react';
import { ExerciseData, ReflectionAnswers, ExerciseTopic } from '../types';

interface ExercisePhaseProps {
  initialExerciseData: ExerciseData;
  reflectionAnswers: ReflectionAnswers;
  onNewExerciseRequest: (topic: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning", difficulty: 'same' | 'harder', previousExercise: any) => void;
  initialTopic: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning";
}

// Sub-components for different exercise types defined outside the main component
// to prevent re-renders and follow best practices.

const VocabularyExercise: React.FC<{ content: any, onAnswersChange: (answers: any) => void, results?: any, isChecked: boolean }> = ({ content, onAnswersChange, results, isChecked }) => {
    const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
    
    const handleChange = (index: number, answer: string) => {
        const newAnswers = {...userAnswers, [index]: answer};
        setUserAnswers(newAnswers);
        onAnswersChange(newAnswers);
    };

    if (content.questions[0].type === 'translate') {
        return (
             <div>
                <p className="mb-4 text-slate-600">{content.instruction}</p>
                {content.questions.map((q: any, index: number) => (
                    <div key={index} className="mb-4">
                        <p className="font-semibold text-slate-700 mb-1">{index+1}. {q.question}</p>
                        <input type="text" disabled={isChecked} value={userAnswers[index] || ''} onChange={(e) => handleChange(index, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                        {isChecked && results && results[index] && (
                            <p className={`mt-1 text-sm ${results[index].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {results[index].isCorrect ? '✔️ Goed!' : `❌ Niet goed. Juist: ${results[index].correctAnswer}`}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <p className="mb-4 text-slate-600">{content.instruction}</p>
            {content.questions.map((q: any, index: number) => (
                <div key={index} className="mb-6 p-4 border-l-4 rounded-r-lg bg-slate-50 border-slate-200">
                    <p className="font-semibold text-slate-800 mb-3">{index + 1}. {q.nl}</p>
                    <div className="space-y-2">
                        {q.options.map((opt: string) => (
                            <label key={opt} className={`flex items-center p-3 rounded-md border cursor-pointer ${ isChecked && results && results[index] && results[index].isCorrect && userAnswers[index] === opt ? 'bg-green-50 border-green-400' : ''} ${ isChecked && results && results[index] && !results[index].isCorrect && userAnswers[index] === opt ? 'bg-red-50 border-red-400' : 'bg-white border-slate-300'}`}>
                                <input type="radio" disabled={isChecked} name={`q-${index}`} value={opt} onChange={() => handleChange(index, opt)} className="h-4 w-4 text-blue-600 focus:ring-blue-500"/>
                                <span className="ml-3 text-slate-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                     {isChecked && results && results[index] && !results[index].isCorrect && (
                        <p className="mt-2 text-sm text-green-700">Juiste antwoord: <span className="font-semibold">{results[index].correctAnswer}</span></p>
                    )}
                </div>
            ))}
        </div>
    );
};

const SentenceExercise: React.FC<{ content: any, onAnswersChange: (answers: any) => void, results?: any, isChecked: boolean }> = ({ content, onAnswersChange, results, isChecked }) => {
    const [userAnswers, setUserAnswers] = useState<(string[]|string)[]>(Array(content.questions.length).fill(content.type === 'order' ? [] : ''));

    const handleOrderClick = (qIndex: number, part: string) => {
        if (isChecked) return;
        const currentAnswer = [...(userAnswers[qIndex] as string[])];
        const newAnswer = currentAnswer.includes(part) ? currentAnswer.filter(p => p !== part) : [...currentAnswer, part];
        updateAnswers(qIndex, newAnswer);
    };

    const handleTranslateChange = (qIndex: number, value: string) => {
        updateAnswers(qIndex, value);
    };
    
    const updateAnswers = (qIndex: number, value: string | string[]) => {
        const newAnswers = [...userAnswers];
        newAnswers[qIndex] = value;
        setUserAnswers(newAnswers);
        onAnswersChange(newAnswers);
    }

    if (content.type === 'order') {
        return (
            <div>
                 <p className="mb-4 text-slate-600">{content.instruction}</p>
                {content.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-slate-50">
                        <p className="font-semibold text-slate-800 mb-2">Zin {qIndex + 1}:</p>
                        <div className="p-3 bg-white border rounded-md min-h-[40px] mb-3 text-slate-700">
                            {(userAnswers[qIndex] as string[]).join(' ')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {q.parts.map((part: string) => (
                                <button key={part} onClick={() => handleOrderClick(qIndex, part)} disabled={isChecked || (userAnswers[qIndex] as string[]).includes(part)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed">
                                    {part}
                                </button>
                            ))}
                        </div>
                         {isChecked && results && results[qIndex] && (
                            <p className={`mt-2 text-sm ${results[qIndex].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {results[qIndex].isCorrect ? '✔️ Goed!' : `❌ Niet goed. Juist: ${results[qIndex].correctAnswer}`}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    // Translate type
    return (
        <div>
            <p className="mb-4 text-slate-600 bg-yellow-50 border border-yellow-300 p-3 rounded-md">⚠️ {content.instruction}</p>
            {content.questions.map((q: any, qIndex: number) => (
                <div key={qIndex} className="mb-4">
                    <p className="font-semibold text-slate-700 mb-1">{qIndex+1}. {q.nl}</p>
                    <input type="text" disabled={isChecked} value={userAnswers[qIndex] as string} onChange={(e) => handleTranslateChange(qIndex, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                    {isChecked && results && results[qIndex] && (
                        <p className={`mt-1 text-sm ${results[qIndex].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {results[qIndex].isCorrect ? '✔️ Goed!' : `❌ Niet goed. Juist: ${results[qIndex].correctAnswer}`}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};


interface GrammarExerciseProps {
  content: any;
  onAnswersChange: (answers: any) => void;
  results?: any;
  isChecked: boolean;
  type: "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning";
}

const GrammarExercise: React.FC<GrammarExerciseProps> = ({ content, onAnswersChange, results, isChecked, type }) => {
    const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
    
    const handleChange = (index: number, answer: string) => {
        const newAnswers = {...userAnswers, [index]: answer};
        setUserAnswers(newAnswers);
        onAnswersChange(newAnswers);
    };

    if (type === 'Grammatica: ontkenning') {
        return (
            <div>
                <p className="mb-4 text-slate-600" dangerouslySetInnerHTML={{ __html: content.instruction }}></p>
                {content.questions.map((q: any, index: number) => (
                    <div key={index} className="mb-4">
                        <p className="font-semibold text-slate-700 mb-1" dangerouslySetInnerHTML={{ __html: `${index+1}. ${q.sentence.part1}` }}></p>
                        <input type="text" disabled={isChecked} value={userAnswers[index] || ''} onChange={(e) => handleChange(index, e.target.value)} className="w-full p-2 border border-slate-300 rounded-md"/>
                        {isChecked && results && results[index] && (
                            <p className={`mt-1 text-sm ${results[index].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {results[index].isCorrect ? '✔️ Goed!' : `❌ Niet goed. Juist: ${results[index].correctAnswer}`}
                            </p>
                        )}
                    </div>
                ))}
                {isChecked && content.feedback && <p className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">💡 {content.feedback}</p>}
             </div>
        )
    }

    return (
        <div>
             <p className="mb-4 text-slate-600">{content.instruction}</p>
             {content.questions.map((q: any, index: number) => (
                 <div key={index} className="mb-4 flex items-center gap-2 flex-wrap">
                     <span className="text-slate-800">{q.sentence.part1}</span>
                     <input type="text" disabled={isChecked} value={userAnswers[index] || ''} onChange={(e) => handleChange(index, e.target.value)} className="p-1 border-b-2 border-slate-300 focus:border-blue-500 outline-none w-28"/>
                     <span className="text-slate-800">{q.sentence.part2}</span>
                      {isChecked && results && results[index] && (
                        <span className={`text-sm ml-2 ${results[index].isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {results[index].isCorrect ? '✔️' : `❌ (Juist: ${results[index].correctAnswer})`}
                        </span>
                    )}
                 </div>
             ))}
             {isChecked && content.feedback && <p className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">💡 {content.feedback}</p>}
        </div>
    );
};

const ReadingExercise: React.FC<{ content: any, onAnswersChange: (answers: any) => void, results?: any, isChecked: boolean }> = ({ content, onAnswersChange, results, isChecked }) => {
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});

    const handleChange = (index: number, answer: string) => {
        const newAnswers = { ...userAnswers, [index]: answer };
        setUserAnswers(newAnswers);
        onAnswersChange(newAnswers);
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                    <p className="whitespace-pre-line text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-lg border">{content.text}</p>
                </div>
                {content.imageUrl && (
                    <div className="md:w-1/3">
                        <img src={content.imageUrl} alt="Illustratie bij de tekst" className="rounded-lg shadow-md aspect-square object-cover" />
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">Vragen:</h4>
                {content.questions.map((q: any, index: number) => (
                    <div key={index} className="mb-6 p-4 border-l-4 rounded-r-lg bg-slate-50 border-slate-200">
                        <p className="font-semibold text-slate-800 mb-3">{index + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((opt: string) => (
                                <label key={opt} className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${isChecked && results && results[index] && results[index].isCorrect && userAnswers[index] === opt ? 'bg-green-50 border-green-400' : ''} ${isChecked && results && results[index] && !results[index].isCorrect && userAnswers[index] === opt ? 'bg-red-50 border-red-400' : 'bg-white border-slate-300 hover:border-blue-400'}`}>
                                    <input type="radio" disabled={isChecked} name={`q-${index}`} value={opt} onChange={() => handleChange(index, opt)} checked={userAnswers[index] === opt} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-3 text-slate-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                        {isChecked && results && results[index] && !results[index].isCorrect && (
                            <p className="mt-2 text-sm text-green-700">Juiste antwoord: <span className="font-semibold">{results[index].correctAnswer}</span></p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const ExercisePhase: React.FC<ExercisePhaseProps> = ({ initialExerciseData, reflectionAnswers, onNewExerciseRequest }) => {
  const [exerciseData, setExerciseData] = useState(initialExerciseData);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [isChecked, setIsChecked] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning">(exerciseData.exercise.type);
  const [isChoosingNewTopic, setIsChoosingNewTopic] = useState(false);

  const results = useMemo(() => {
    if (!isChecked) return null;
    const { type, content } = exerciseData.exercise;

    // Helper to normalize strings for comparison: trims, lowercases, removes punctuation.
    const normalizeSentence = (str: string) => {
        if (typeof str !== 'string') return '';
        return str.trim().toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ');
    };

    const newResults: { [key: number]: { isCorrect: boolean; correctAnswer: string } } = {};
    content.questions.forEach((q: any, index: number) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = q.correct;
      let isCorrect = false;

      const isMcq = type === 'Leesvaardigheid' || (type === 'Woordjes' && q.type === 'mcq');
      const needsSentenceNormalization = type === 'Franse zinnen maken' || type === 'Grammatica: ontkenning';
      const isVocabTranslate = type === 'Woordjes' && q.type === 'translate';
      
      if (isMcq) {
          isCorrect = userAnswer === correctAnswer;
      } else if (needsSentenceNormalization) {
          const userAnswerAsString = Array.isArray(userAnswer) ? userAnswer.join(' ') : (userAnswer || '');
          isCorrect = normalizeSentence(userAnswerAsString) === normalizeSentence(correctAnswer);
      } else if (isVocabTranslate) {
          isCorrect = normalizeSentence(userAnswer || '') === normalizeSentence(correctAnswer);
      } else { // Default for single word inputs like -er verbs
          isCorrect = (userAnswer || '').trim().toLowerCase() === correctAnswer.toLowerCase();
      }

      newResults[index] = { isCorrect, correctAnswer: q.correct };
    });
    return newResults;
  }, [isChecked, userAnswers, exerciseData]);

  const allAnswered = useMemo(() => {
    const numQuestions = exerciseData.exercise.content.questions.length;
    return Object.keys(userAnswers).length === numQuestions && Object.values(userAnswers).every(a => (Array.isArray(a) ? a.length > 0 : a !== null && a !== undefined && a !== ''));
  }, [userAnswers, exerciseData]);

  const handleCheckAnswers = () => setIsChecked(true);

  const handleRequest = (difficulty: 'same' | 'harder') => {
    const topicToRequest = currentTopic === 'Grammatica' ? (reflectionAnswers[1] === 'Grammatica: werkwoorden op -er' ? 'Grammatica: werkwoorden op -er' : 'Grammatica: ontkenning') : currentTopic;
    onNewExerciseRequest(topicToRequest, difficulty, exerciseData.exercise);
    resetState();
  };

  const handleTopicChoice = (topic: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning") => {
     onNewExerciseRequest(topic, 'same', exerciseData.exercise);
     resetState();
  }

  const resetState = () => {
    setIsChecked(false);
    setUserAnswers({});
    setIsChoosingNewTopic(false);
  }

  const renderExercise = () => {
    const { type, content } = exerciseData.exercise;
    const props = { content, onAnswersChange: setUserAnswers, results, isChecked };

    switch(type) {
        case 'Woordjes': return <VocabularyExercise {...props} />;
        case 'Franse zinnen maken': return <SentenceExercise {...props} />;
        case 'Grammatica: werkwoorden op -er':
        case 'Grammatica: ontkenning': return <GrammarExercise {...props} type={type} />;
        case 'Leesvaardigheid': return <ReadingExercise {...props} />;
        default: return <p>Oefening type niet gevonden.</p>
    }
  };

  if (isChoosingNewTopic) {
      const topicChoices = [
        { label: "Woordjes", value: "Woordjes" as const },
        { label: "Grammatica – werkwoorden op -er", value: "Grammatica: werkwoorden op -er" as const },
        { label: "Grammatica – ontkenning", value: "Grammatica: ontkenning" as const },
        { label: "Leesvaardigheid", value: "Leesvaardigheid" as const },
        { label: "Zinnen maken", value: "Franse zinnen maken" as const }
      ];
      return (
        <div className="animate-fade-in">
             <h3 className="text-xl font-bold text-slate-800 mb-4">🔁 Kies een ander onderdeel</h3>
             <p className="text-slate-600 mb-6">Waar wil je nu mee oefenen?</p>
             <div className="space-y-3">
                 {topicChoices.map(topic => (
                     <button key={topic.value} onClick={() => handleTopicChoice(topic.value)} className="w-full text-left p-4 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                         {topic.label}
                     </button>
                 ))}
             </div>
        </div>
      )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 p-5 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-2">💬 Terugkoppeling op jouw reflectie</h3>
        <p className="text-slate-700">{exerciseData.feedback}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-2">📌 Korte conclusie na je reflectie</h3>
        <p className="text-slate-700">{exerciseData.conclusion}</p>
      </div>

      <div className="p-6 border border-slate-200 rounded-xl">
        <h3 className="text-2xl font-bold text-blue-600 mb-4">🎯 Oefenopdracht: {exerciseData.exercise.title}</h3>
        {renderExercise()}

        <div className="mt-8 pt-6 border-t">
          {!isChecked ? (
            <button onClick={handleCheckAnswers} disabled={!allAnswered} className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-slate-300 transition-all">
              🔍 Nakijken
            </button>
          ) : (
            <div className="animate-fade-in">
                 <h3 className="text-xl font-bold text-slate-800 mb-4">🔁 Verder oefenen?</h3>
                 <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => handleRequest('same')} className="flex-1 px-4 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all">Nog een opdracht (zelfde niveau)</button>
                    <button onClick={() => handleRequest('harder')} className="flex-1 px-4 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all">Iets moeilijkere opdracht</button>
                    <button onClick={() => setIsChoosingNewTopic(true)} className="flex-1 px-4 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all">Ander onderdeel oefenen</button>
                 </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePhase;
