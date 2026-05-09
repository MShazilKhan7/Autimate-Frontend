// Mock word list with phoneme breakdowns matching the API response structure

export interface TherapyWord {
  id: number;
  word: string;
  images: string[];
  category: string;
  phonemes: string[]; // visual breakdown
}

export interface ExerciseWord {
  word: string;
  relatedPhoneme: string[];
  level: number;
  image: string[];
}

/** Matches `data/exercisesCurriculum.json` — use when merging steps with `therapyWords`. */
export type CurriculumExerciseKind =
  | "imitation"
  | "phoneme_completion"
  | "expressive_label"
  | "receptive_choice"
  | "word_completion"
  | "checkpoint";

export type CurriculumPhase =
  | "say_it_together"
  | "sound_puzzle"
  | "name_it"
  | "listen_and_tap"
  | "finish_the_word";

export enum EXERCISE_KIND {
  IMIATION = "imitation",
  PHONEME_COMPLETION = "phoneme_completion",
  EXPRESSIVE_LABEL = "expressive_label",
  RECEPTIVE_CHOICE = "receptive_choice",
  WORD_COMPLETION = "word_completion",
  CHECKPOINT = "checkpoint",
}

export interface CurriculumStepBase {
  id: string;
  order: number;
  type: CurriculumExerciseKind;
  wordId?: number;
  phase?: CurriculumPhase;
  title?: string;
  instructions?: string;
  hints?: string[];
}

export interface ImitationStep extends CurriculumStepBase {
  type: EXERCISE_KIND.IMIATION;
  wordId: number;
  title: string;
  instructions: string;
  ui?: { showPhonemeTiles?: boolean; emphasis?: "listen_then_repeat" };
}

export interface PhonemeCompletionStep extends CurriculumStepBase {
  type: EXERCISE_KIND.PHONEME_COMPLETION;
  wordId: number;
  phonemeSlots: (string | null)[];
  options: string[];
  correctOption: string;
}

export interface ExpressiveLabelStep extends CurriculumStepBase {
  type: EXERCISE_KIND.EXPRESSIVE_LABEL;
  wordId: number;
  acceptableAnswers: string[];
}

export interface ReceptiveChoiceStep extends CurriculumStepBase {
  type: EXERCISE_KIND.RECEPTIVE_CHOICE;
  wordId: number;
  promptSpoken?: string;
  choiceWordIds: number[];
  correctWordId: number;
  shuffle?: boolean;
  layout?: "grid" | "row";
}

export interface WordCompletionStep extends CurriculumStepBase {
  type: EXERCISE_KIND.WORD_COMPLETION;
  wordId: number;
  partialDisplay: string;
  expectedSpeakWord: string;
}

export interface CheckpointStep extends CurriculumStepBase {
  type: EXERCISE_KIND.CHECKPOINT;
  body: string;
  celebrate?: boolean;
  /** Short phrase spoken aloud before continuing (defaults in UI if omitted). */
  speakPhrase?: string;
}

export type CurriculumStep =
  | ImitationStep
  | PhonemeCompletionStep
  | ExpressiveLabelStep
  | ReceptiveChoiceStep
  | WordCompletionStep
  | CheckpointStep;

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  focus: string;
  wordIds: number[];
  lessonIntro?: { title: string; body: string };
  steps: CurriculumStep[];
}

export interface ExercisesCurriculum {
  version: number;
  title: string;
  description: string;
  exerciseKinds: CurriculumExerciseKind[];
  modules: CurriculumModule[];
}

/** Shape returned from `/api/score-speech` — optional fields used by therapy UI. */
export interface SpeechAPIResponse {
  text_score?: {
    word_score_list?: Array<{
      quality_score?: number;
      quality_class?: string;
      phone_score_list?: unknown[];
    }>;
  };
}

export function getTherapyWordById(id: number, words: TherapyWord[] = therapyWords): TherapyWord | undefined {
  return words.find((w) => w.id === id);
}

/** Distinct word categories covered by a module’s vocabulary (for UI chips). */
export function getCategoryLabelsForModule(
  module: { wordIds: number[] },
  words: TherapyWord[] = therapyWords,
): string[] {
  const labels = new Set<string>();
  for (const id of module.wordIds) {
    const w = getTherapyWordById(id, words);
    if (w?.category) labels.add(w.category);
  }
  return Array.from(labels).sort((a, b) => a.localeCompare(b));
}

export const therapyWords: TherapyWord[] = [
  {
    id: 1,
    word: "Apple",
    images: [
      "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400&h=400&fit=crop",
    ],
    category: "fruit",
    phonemes: ["AE", "P", "AH", "L"],
  },
  {
    id: 2,
    word: "Cat",
    images: [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    ],
    category: "animal",
    phonemes: ["K", "AE", "T"],
  },
  {
    id: 3,
    word: "Dog",
    images: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    ],
    category: "animal",
    phonemes: ["D", "AO", "G"],
  },
  {
    id: 4,
    word: "Bank",
    images: [
      "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=400&fit=crop",
    ],
    category: "object",
    phonemes: ["B", "AE", "NG", "K"],
  },
  {
    id: 5,
    word: "Ball",
    images: [
      "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&h=400&fit=crop",
    ],
    category: "toy",
    phonemes: ["B", "AO", "L"],
  },
  {
    id: 6,
    word: "Fish",
    images: [
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop",
    ],
    category: "animal",
    phonemes: ["F", "IH", "SH"],
  },
  {
    id: 7,
    word: "Sun",
    images: [
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=400&fit=crop",
    ],
    category: "nature",
    phonemes: ["S", "AH", "N"],
  },
  {
    id: 8,
    word: "Bird",
    images: [
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=400&fit=crop",
    ],
    category: "animal",
    phonemes: ["B", "ER", "D"],
  },
  {
    id: 9,
    word: "Banana",
    images: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    ],
    category: "fruit",
    phonemes: ["B", "AH", "N", "AE", "N", "AH"],
  },
  {
    id: 10,
    word: "Orange",
    images: [
      "https://images.unsplash.com/photo-1547514701-427821017808?w=400&h=400&fit=crop",
    ],
    category: "fruit",
    phonemes: ["AO", "R", "AH", "N", "JH"],
  },
  {
    id: 11,
    word: "Grapes",
    images: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=400&fit=crop",
    ],
    category: "fruit",
    phonemes: ["G", "R", "EY", "P", "S"],
  },
];