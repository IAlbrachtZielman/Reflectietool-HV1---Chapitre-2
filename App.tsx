
import React, { useState, useCallback } from 'react';
import { ReflectionAnswers, ExerciseData, ExerciseTopic } from './types';
import ReflectionPhase from './components/ReflectionPhase';
import ExercisePhase from './components/ExercisePhase';
import { generateFeedbackAndExercise } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'reflection' | 'exercise'>('reflection');
  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswers | null>(null);
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning" | null>(null);

  const handleReflectionComplete = useCallback(async (answers: ReflectionAnswers) => {
    setIsLoading(true);
    setError(null);
    try {
      const topic = answers[5] as ExerciseTopic; // Question 6 determines the topic
      setCurrentTopic(topic);
      const data = await generateFeedbackAndExercise(answers, topic);
      setReflectionAnswers(answers);
      setExerciseData(data);
      setAppState('exercise');
    } catch (e) {
      setError('Er is iets misgegaan bij het genereren van de oefening. Probeer het opnieuw.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNewExerciseRequest = useCallback(async (topic: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning", difficulty: 'same' | 'harder', previousExercise: any) => {
    setIsLoading(true);
    setError(null);
    if (!reflectionAnswers) {
      setError("Reflectie-antwoorden niet gevonden.");
      setIsLoading(false);
      return;
    }
    try {
      setCurrentTopic(topic);
      const data = await generateFeedbackAndExercise(reflectionAnswers, topic, difficulty, previousExercise);
      setExerciseData(data);
    } catch (e) {
      setError('Er is iets misgegaan bij het genereren van de nieuwe oefening. Probeer het opnieuw.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [reflectionAnswers]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-slate-600 text-lg">Je persoonlijke opdracht wordt voorbereid...</p>
        </div>
      );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>
    }

    switch (appState) {
      case 'reflection':
        return <ReflectionPhase onReflectionComplete={handleReflectionComplete} />;
      case 'exercise':
        if (exerciseData && reflectionAnswers) {
            return <ExercisePhase 
                initialExerciseData={exerciseData} 
                reflectionAnswers={reflectionAnswers}
                onNewExerciseRequest={handleNewExerciseRequest}
                initialTopic={currentTopic!}
            />;
        }
        return null; // Should not happen
      default:
        return <div>Laden...</div>;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Franse Leercoach</h1>
        <p className="text-slate-500 mt-2 text-lg">Jouw persoonlijke hulp na de toets.</p>
      </header>
      <main>
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 min-h-[400px]">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center mt-8 text-slate-400 text-sm">
        <p>&copy; 2024 Leercoach App. Alle rechten voorbehouden.</p>
      </footer>
    </div>
  );
};

export default App;
