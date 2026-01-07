
import { ReflectionAnswers, ExerciseData, ExerciseTopic } from '../types';
import { SOURCE_VOCABULARY, SOURCE_SENTENCES, SOURCE_ER_VERBS } from '../constants';

// This is a MOCK service that simulates the Gemini API.
// It follows all the rules specified in the prompt to generate a valid, functional application.
// In a real-world scenario, this would be replaced with an actual API call to the Gemini API.

const generateFeedback = (answers: ReflectionAnswers): { feedback: string; conclusion: string } => {
  let feedback = "Bedankt voor het invullen van je reflectie. Ik zie dat je goed hebt nagedacht over hoe de toets ging en je voorbereiding. ";
  const prep = answers[2] as string[];
  if (prep.includes('Ik heb niet echt geleerd')) {
    feedback += "Het valt op dat je niet veel tijd aan de voorbereiding hebt besteed, dus het is super dat je nu wilt oefenen!";
  } else {
    feedback += "Het is goed om te zien welke manieren van leren voor jou werkten. Dat is een mooie basis om op verder te bouwen.";
  }

  let conclusion = "Je hebt duidelijk voor ogen waar je aan wilt werken. ";
  const goal = answers[5];
  conclusion += `We gaan nu gericht aan de slag met '${goal}', zodat je de volgende keer nog zelfverzekerder bent. Zet 'm op!`;

  return { feedback, conclusion };
};


const shuffleArray = <T,>(array: T[]): T[] => {
    return array.sort(() => 0.5 - Math.random());
}

const READING_TEXT_POOL = [
    {
        text: "Salut, je m'appelle Léo. Aujourd'hui, je vais au supermarché avec ma mère. Nous avons besoin de beaucoup de choses. J'aime faire les courses.\n\nDans le supermarché, nous cherchons des légumes et des fruits. Ma mère achète des tomates, une salade et des pommes. Moi, je voudrais une pizza pour le dîner, mais ma mère préfère le poisson avec des frites. C'est bon aussi!\n\nAprès le supermarché, nous allons à la boulangerie. Ma mère achète une baguette. Ça coûte deux euros. J'aime beaucoup le pain français.",
        topic: "supermarché",
        questions: [
            { question: "Waar gaat Léo vandaag naartoe?", options: ["Naar de supermarkt", "Naar school", "Naar de bakker"], correct: "Naar de supermarkt" },
            { question: "Met wie gaat Léo boodschappen doen?", options: ["Met zijn moeder", "Met zijn vader", "Alleen"], correct: "Met zijn moeder" },
            { question: "Wat wil Léo graag eten voor het avondeten?", options: ["Een pizza", "Vis met friet", "Een salade"], correct: "Een pizza" },
            { question: "Wat koopt de moeder van Léo bij de bakker?", options: ["Een stokbrood", "Een croissant", "Tomaten"], correct: "Een stokbrood" },
            { question: "Vindt Léo het leuk om boodschappen te doen?", options: ["Ja", "Nee", "Dat staat niet in de tekst"], correct: "Ja" }
        ]
    },
    {
        text: "Bonjour, je suis Chloé. J'habite dans une petite maison avec ma famille. J'ai un frère. Il s'appelle Thomas. Nous avons aussi un chien. Le chien est très sympa.\n\nLe week-end, j'aime écouter de la musique dans ma chambre. Mon frère préfère regarder la télévision. Parfois, nous jouons ensemble dans le jardin. C'est amusant.\n\nPour le dîner, ma mère prépare souvent une salade avec du poulet. Mon père aide toujours dans la cuisine. Nous mangeons tous ensemble à la grande table. C'est un moment important pour la famille.",
        topic: "famille",
        questions: [
            { question: "Met wie woont Chloé?", options: ["Met haar familie", "Met haar vrienden", "Alleen"], correct: "Met haar familie" },
            { question: "Wat doet Chloé graag in het weekend?", options: ["Naar muziek luisteren", "Televisie kijken", "Boodschappen doen"], correct: "Naar muziek luisteren" },
            { question: "Wat doet haar broer Thomas graag?", options: ["Televisie kijken", "In de tuin spelen", "Muziek luisteren"], correct: "Televisie kijken" },
            { question: "Wie helpt er in de keuken?", options: ["Haar vader", "Haar broer", "Chloé"], correct: "Haar vader" },
            { question: "Wat is een belangrijk moment voor de familie?", options: ["Samen eten", "Het weekend", "Naar muziek luisteren"], correct: "Samen eten" }
        ]
    }
];

const getVocabularyExercise = (difficulty: 'same' | 'harder' = 'same', previousWords: string[] = []) => {
    const availableWords = SOURCE_VOCABULARY.filter(w => !previousWords.includes(w.nl));
    const selectedWords = shuffleArray(availableWords).slice(0, 10);
    
    if (difficulty === 'harder') {
        const questions = selectedWords.map(word => {
            const direction = Math.random() > 0.5 ? 'nl-fr' : 'fr-nl';
            return {
                question: direction === 'nl-fr' ? word.nl : word.fr,
                correct: direction === 'nl-fr' ? word.fr : word.nl,
                type: 'translate'
            };
        });
        return {
            type: 'Woordjes' as const,
            title: "Woordenschat (vertalen)",
            content: {
                instruction: "Typ de juiste vertaling.",
                questions: questions
            }
        };
    }

    const questions = selectedWords.map(word => {
        const distractors = shuffleArray(SOURCE_VOCABULARY.filter(d => d.fr !== word.fr)).slice(0, 2).map(d => d.fr);
        const options = shuffleArray([word.fr, ...distractors]);
        return {
            nl: word.nl,
            options: options,
            correct: word.fr,
            type: 'mcq'
        };
    });
    
    return {
        type: 'Woordjes' as const,
        title: "Woordenschat",
        content: {
            instruction: "Kies de juiste Franse vertaling.",
            questions: questions
        }
    };
};

const getSentenceExercise = (difficulty: 'same' | 'harder' = 'same', previousSentences: string[] = []) => {
    const availableSentences = SOURCE_SENTENCES.filter(s => !previousSentences.includes(s.fr));
    const selectedSentences = shuffleArray(availableSentences).slice(0, 6);

    if (difficulty === 'harder') {
        return {
             type: 'Franse zinnen maken' as const,
             title: "Zinnen vertalen",
             content: {
                 type: 'translate',
                 instruction: 'Let op: begin de zin met een hoofdletter en let goed op de streepjes (é, è, ê).',
                 questions: selectedSentences.map(s => ({ nl: s.nl, correct: s.fr }))
             }
        }
    }

    const questions = selectedSentences.map(sentence => ({
        parts: shuffleArray(sentence.fr.replace('.', '').split(' ')),
        correct: sentence.fr
    }));

     return {
        type: 'Franse zinnen maken' as const,
        title: "Zinnen maken",
        content: {
            type: 'order',
            instruction: "Zet de woorden in de juiste volgorde om een correcte zin te maken.",
            questions: questions
        }
    };
};


const getGrammarExercise = (subtopic: string, difficulty: 'same' | 'harder' = 'same', previousVerbs: string[] = []) => {
    if (subtopic.includes('werkwoorden op -er')) {
         const availableVerbs = SOURCE_ER_VERBS.filter(v => !previousVerbs.includes(v));
         const selectedVerbs = shuffleArray(availableVerbs).slice(0, 8);
         const pronouns = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
         const endings: {[key: string]: string} = { 'je': 'e', 'tu': 'es', 'il': 'e', 'elle': 'e', 'nous': 'ons', 'vous': 'ez', 'ils': 'ent', 'elles': 'ent' };
        
         const questions = selectedVerbs.map((verb, i) => {
             const pronoun = pronouns[i % pronouns.length];
             const stem = verb.slice(0, -2);
             const correct = stem + endings[pronoun];
             const sentencePart2 = verb === 'chercher' ? ' la boulangerie.' : verb === 'aimer' ? ' les crêpes.' : ' à Paris.';
             return {
                 sentence: {
                     part1: `${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)}`,
                     part2: `(${verb})${sentencePart2}`
                 },
                 correct: correct
             };
         });

        return {
            type: 'Grammatica: werkwoorden op -er' as const,
            title: 'Grammatica: Werkwoorden op -er',
            content: {
                instruction: "Vervoeg het werkwoord op -er. Vul de juiste vorm in.",
                questions,
                feedback: null
            }
        };
    } else { // Ontkenning
        const sentences = [
            { s: "Elle trouve le pain.", c: "Elle ne trouve pas le pain.", v: "trouve" },
            { s: "J'aime le lait.", c: "Je n'aime pas le lait.", v: "aime" },
            { s: "Il habite à Paris.", c: "Il n'habite pas à Paris.", v: "habite" },
            { s: "C'est bon.", c: "Ce n'est pas bon.", v: "est" },
            { s: "Tu parles français.", c: "Tu ne parles pas français.", v: "parles" },
            { s: "Nous cherchons le magasin.", c: "Nous ne cherchons pas le magasin.", v: "cherchons" },
            { s: "Vous demandez l'addition.", c: "Vous ne demandez pas l'addition.", v: "demandez" },
            { s: "Ils préfèrent la pizza.", c: "Ils ne préfèrent pas la pizza.", v: "préfèrent" }
        ];
        const selected = shuffleArray(sentences).slice(0, 8);

        const questions = selected.map(item => {
            let sentenceToDisplay = item.s;
            if (difficulty === 'same') {
                sentenceToDisplay = item.s.replace(item.v, `<u>${item.v}</u>`);
            }
            return {
                sentence: { part1: sentenceToDisplay, part2: '' }, // Re-using structure, part1 is the full sentence
                correct: item.c
            }
        });
        
         return {
            type: 'Grammatica: ontkenning' as const,
            title: 'Grammatica: De ontkenning',
            content: {
                instruction: `Maak de zin ontkennend. Typ de hele, nieuwe zin. ${difficulty === 'same' ? 'Het werkwoord is al <u>onderstreept</u>.' : ''}`,
                questions,
                feedback: "Tip: zoek eerst het werkwoord in de zin. Zet daarna de ontkenning eromheen: ne … pas. Begint het werkwoord met een klinker, dan wordt 'ne' → 'n’'."
            }
        };
    }
};

const getReadingExercise = (difficulty: 'same' | 'harder' = 'same', previousText?: string) => {
    // Filter out the previous text to ensure a new one is selected.
    const availableTexts = previousText 
        ? READING_TEXT_POOL.filter(t => t.text !== previousText)
        : READING_TEXT_POOL;
    
    // If all texts have been used, reset the pool. For simplicity, we just pick a random one.
    const poolToUse = availableTexts.length > 0 ? availableTexts : READING_TEXT_POOL;
    const selectedTextData = shuffleArray(poolToUse)[0];

    let imageUrl = null;
    if (selectedTextData.topic === "supermarché") {
        imageUrl = "https://picsum.photos/seed/market/400/400";
    } else if (selectedTextData.topic === "famille") {
        imageUrl = "https://picsum.photos/seed/family/400/400";
    }
    
    // Shuffle options for each question to make it dynamic
    const questionsWithShuffledOptions = selectedTextData.questions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
    }));

    return {
        type: 'Leesvaardigheid' as const,
        title: "Leesvaardigheid",
        content: {
            text: selectedTextData.text,
            imageUrl: imageUrl, // Can be null
            questions: questionsWithShuffledOptions
        }
    };
};

export const generateFeedbackAndExercise = (
  answers: ReflectionAnswers,
  topic: ExerciseTopic | "Grammatica: werkwoorden op -er" | "Grammatica: ontkenning",
  difficulty: 'same' | 'harder' = 'same',
  previousExercise?: any
): Promise<ExerciseData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { feedback, conclusion } = generateFeedback(answers);
      
      let exercise;
      const previousContent = previousExercise?.content?.questions || [];
      
      if (topic === 'Woordjes') {
        const previousWords = previousContent.map((q: any) => q.nl || q.question); // Handles both mcq and translate
        exercise = getVocabularyExercise(difficulty, previousWords);
      } else if (topic === 'Franse zinnen maken') {
        const previousSentences = previousContent.map((q: any) => q.correct);
        exercise = getSentenceExercise(difficulty, previousSentences);
      } else if (topic === 'Grammatica') {
        // From reflection, question 2 gives the subtopic
        const subtopic = answers[1] as string;
        exercise = getGrammarExercise(subtopic, difficulty);
      } else if (topic === 'Grammatica: werkwoorden op -er' || topic === 'Grammatica: ontkenning') {
        exercise = getGrammarExercise(topic, difficulty);
      }
      else if (topic === 'Leesvaardigheid') {
        const previousText = previousExercise?.content?.text;
        exercise = getReadingExercise(difficulty, previousText);
      } else {
        // Fallback
        exercise = getVocabularyExercise();
      }

      resolve({
        feedback,
        conclusion,
        exercise,
      });
    }, 1000); // Simulate network delay
  });
};
