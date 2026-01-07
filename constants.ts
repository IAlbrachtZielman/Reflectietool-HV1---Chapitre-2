
import { ReflectionQuestion } from './types';

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: 0,
    question: 'Hoe ging de toets volgens jou?',
    type: 'single-choice',
    options: ['Het ging moeilijk.', 'Het ging redelijk.', 'Het ging goed.'],
  },
  {
    id: 1,
    question: 'Welk onderdeel vond je het lastigst op de toets?',
    type: 'single-choice',
    options: [
      'Woordenschat',
      'Grammatica: werkwoorden op -er',
      'Grammatica: ontkenning',
      'Leesvaardigheid',
      'Luistervaardigheid',
      'Zinnen maken',
    ],
  },
  {
    id: 2,
    question: 'Hoe heb je je voorbereid op de toets?',
    subtitle: '(Meerdere antwoorden mogelijk)',
    type: 'multiple-choice',
    options: [
      'Woorden online geleerd',
      'Woorden doorgelezen',
      'Grammatica geoefend',
      'Leesopdrachten gemaakt',
      'Uitleg opnieuw bekeken',
      'Samen geleerd / laten overhoren',
      'Oefentoets gemaakt',
      'Ik heb niet echt geleerd',
    ],
  },
  {
    id: 3,
    question: 'Wanneer ben je begonnen met leren?',
    type: 'single-choice',
    options: [
      'Meer dan een week van tevoren',
      'Een paar dagen van tevoren',
      '1 dag of later',
      'Ik heb nauwelijks geleerd',
    ],
  },
  {
    id: 4,
    question: 'Welke manier van voorbereiden hielp je het meest?',
    subtitle: '(Kies de beste optie)',
    type: 'single-choice',
    options: [
      'Oefenen met opdrachten',
      'Woorden leren',
      'Uitleg opnieuw bekijken',
      'Me laten overhoren',
      'De oefentoets maken',
      'Mijn voorbereiding hielp niet goed',
    ],
  },
  {
    id: 5,
    question: 'Waar wil je als EERSTE mee oefenen voor de volgende toets?',
    type: 'single-choice',
    options: ['Woordjes', 'Grammatica', 'Leesvaardigheid', 'Franse zinnen maken'],
  },
  {
    id: 6,
    question: 'Wat ga je de volgende keer anders doen om je resultaat te verbeteren?',
    type: 'short-text',
  },
];

export const SOURCE_VOCABULARY: { nl: string; fr: string }[] = [
    { nl: "het ijsje", fr: "la glace" }, { nl: "de tafel", fr: "la table" }, { nl: "de koffie", fr: "le café" },
    { nl: "lekker", fr: "bon" }, { nl: "duur", fr: "cher" }, { nl: "ik neem", fr: "je prends" },
    { nl: "ik zou graag willen", fr: "je voudrais" }, { nl: "het kost", fr: "ça coûte" }, { nl: "u kunt", fr: "tu peux" },
    { nl: "komen", fr: "venir" }, { nl: "het nagerecht", fr: "le dessert" }, { nl: "het hoofdgerecht", fr: "le plat principal" },
    { nl: "de soep", fr: "la soupe" }, { nl: "de salade, de sla", fr: "la salade" }, { nl: "de groente", fr: "le légume" },
    { nl: "het vlees", fr: "la viande" }, { nl: "de vis", fr: "le poisson" }, { nl: "de kip", fr: "le poulet" },
    { nl: "de frietjes", fr: "les frites" }, { nl: "de pizza", fr: "la pizza" }, { nl: "de pannenkoek", fr: "la crêpe" },
    { nl: "het water", fr: "l'eau" }, { nl: "de thee", fr: "le thé" }, { nl: "de melk", fr: "le lait" },
    { nl: "liever hebben", fr: "préférer" }, { nl: "een hekel hebben aan", fr: "détester" }, { nl: "aankomen", fr: "arriver" },
    { nl: "bellen", fr: "téléphoner" }, { nl: "oké", fr: "d'accord" }, { nl: "dus", fr: "donc" }, { nl: "en", fr: "et" },
    { nl: "ook", fr: "aussi" }, { nl: "voor mij", fr: "pour moi" }, { nl: "het kind", fr: "l'enfant" },
    { nl: "de supermarkt", fr: "le supermarché" }, { nl: "het plein", fr: "la place" }, { nl: "de afspraak", fr: "le rendez-vous" },
    { nl: "het probleem", fr: "le problème" }, { nl: "helpen", fr: "aider" }, { nl: "zoeken", fr: "chercher" },
    { nl: "vinden", fr: "trouver" }, { nl: "luisteren naar", fr: "écouter" }, { nl: "houden van", fr: "aimer" },
    { nl: "morgen", fr: "demain" }, { nl: "beroemd", fr: "célèbre" }, { nl: "belangrijk", fr: "important(e)" },
    { nl: "nu", fr: "maintenant" }, { nl: "ik heb nodig", fr: "j'ai besoin de" }, { nl: "maar", fr: "mais" },
    { nl: "met", fr: "avec" }, { nl: "veel", fr: "beaucoup" }, { nl: "altijd", fr: "toujours" }, { nl: "hoeveel", fr: "combien" },
    { nl: "de winkel", fr: "le magasin" }, { nl: "de vriendin", fr: "la copine" }, { nl: "de vriend", fr: "le copain" },
    { nl: "de bakkerij", fr: "la boulangerie" }, { nl: "de croissant", fr: "le croissant" }, { nl: "kopen", fr: "acheter" },
    { nl: "vragen", fr: "demander" }, { nl: "boodschappen doen", fr: "faire les courses" }, { nl: "ik heb honger", fr: "j'ai faim" },
    { nl: "ik heb dorst", fr: "j'ai soif" }, { nl: "het stokbrood", fr: "la baguette" }, { nl: "de kaas", fr: "le fromage" },
    { nl: "de tas", fr: "le sac" }, { nl: "nieuw", fr: "nouveau/nouvelle" }, { nl: "vaak", fr: "souvent" },
    { nl: "omdat", fr: "parce que" }, { nl: "dertig", fr: "trente" }, { nl: "veertig", fr: "quarante" },
    { nl: "vijftig", fr: "cinquante" }, { nl: "zestig", fr: "soixante" }
];

export const SOURCE_SENTENCES: { nl: string; fr: string }[] = [
    { nl: "Meneer, de kaart alstublieft.", fr: "Monsieur, la carte s'il vous plaît." },
    { nl: "Een cola en een pizza, alstublieft.", fr: "Un coca et une pizza, s'il vous plaît." },
    { nl: "Waar zijn de wc's?", fr: "Où sont les toilettes?" },
    { nl: "Het is hier.", fr: "C'est ici." },
    { nl: "Meneer, de rekening alstublieft.", fr: "Monsieur, l'addition s'il vous plaît." },
    { nl: "Alstublieft.", fr: "Voilà." },
    { nl: "Bedankt en tot ziens!", fr: "Merci et au revoir!" },
    { nl: "Graag gedaan.", fr: "De rien." },
    { nl: "Houd je van pannenkoeken?", fr: "Tu aimes les crêpes?" },
    { nl: "Nee, ik vind pannenkoeken niet lekker.", fr: "Non, je déteste les crêpes." },
    { nl: "Ik heb liever pizza's.", fr: "Je préfère les pizzas." },
    { nl: "Sorry, ik zoek de bakkerij.", fr: "Pardon, je cherche la boulangerie." },
    { nl: "Het is daar.", fr: "C'est là-bas." },
    { nl: "Ik wil graag twee croissants.", fr: "Je voudrais deux croissants." },
    { nl: "Ja, alstublieft.", fr: "Oui, voilà." },
    { nl: "Heeft u een stokbrood?", fr: "Vous avez une baguette?" },
    { nl: "Hoeveel kost dat?", fr: "Ça coûte combien?" },
    { nl: "Dat kost 5 euro 50.", fr: "Ça coûte cinq euros cinquante." },
    { nl: "Ik begrijp het niet.", fr: "Je ne comprends pas." },
];

export const SOURCE_ER_VERBS: string[] = [
    "chercher", "trouver", "aimer", "détester", "préférer", "habiter", "parler", "regarder", "demander", "écouter", "célébrer", "téléphoner"
];
