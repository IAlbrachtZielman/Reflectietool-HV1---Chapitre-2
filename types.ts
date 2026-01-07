
export type QuestionType = 'single-choice' | 'multiple-choice' | 'short-text';

export interface ReflectionQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options?: string[];
  subtitle?: string;
}

export type ReflectionAnswers = {
  [key: number]: string | string[];
};

export type ExerciseTopic = "Woordjes" | "Grammatica" | "Leesvaardigheid" | "Franse zinnen maken";

// This is a generic structure. Specific exercises will have more detailed types.
export interface ExerciseData {
  feedback: string;
  conclusion: string;
  exercise: {
    type: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning";
    title: string;
    // The content will be specific to each exercise type
    content: any;
  };
}
