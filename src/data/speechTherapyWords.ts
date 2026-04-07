// Mock word list with phoneme breakdowns matching the API response structure

export interface PhonemeScore {
  phone: string;
  quality_score: number;
  sound_most_like: string;
}

export interface WordScore {
  word: string;
  quality_score: number;
  quality_class: "pass" | "fail";
  phone_score_list: PhonemeScore[];
}

export interface TextScore {
  text: string;
  quality_score: number;
  fidelity_class: string;
  word_score_list: WordScore[];
  annotation: {
    score: number;
    correct: boolean;
    all_correct: boolean;
  };
}

export interface SpeechAPIResponse {
  status: string;
  text_score: TextScore;
}

export interface TherapyWord {
  id: number;
  word: string;
  image: string;
  category: string;
  phonemes: string[]; // visual breakdown
  mockResponse: SpeechAPIResponse;
}

export interface ExerciseWord {
  word: string;
  relatedPhoneme: string[];
  level: number;
  image: string[];
}

export const therapyWords: TherapyWord[] = [
  {
    id: 1,
    word: "Apple",
    image:
      "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400&h=400&fit=crop",
    category: "fruit",
    phonemes: ["AE", "P", "AH", "L"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Apple",
        quality_score: 92,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Apple",
            quality_score: 92,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "ae",
                quality_score: 95,
                sound_most_like: "ae",
              },
              {
                phone: "p",
                quality_score: 88,
                sound_most_like: "p",
              },
              {
                phone: "ah",
                quality_score: 78,
                sound_most_like: "ah",
                
              },
              {
                phone: "l",
                quality_score: 100,
                sound_most_like: "l",
              },
            ],
          },
        ],
        annotation: { score: 92, correct: true, all_correct: false },
      },
    },
  },
  {
    id: 2,
    word: "Cat",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    category: "animal",
    phonemes: ["K", "AE", "T"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Cat",
        quality_score: 97,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Cat",
            quality_score: 97,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "k",
                quality_score: 100,
                sound_most_like: "k",
                annotation: { correct: true, comment: "Good", score: 100 },
              },
              {
                phone: "ae",
                quality_score: 95,
                sound_most_like: "ae",
                annotation: { correct: true, comment: "Good", score: 95 },
              },
              {
                phone: "t",
                quality_score: 96,
                sound_most_like: "t",
                annotation: { correct: true, comment: "Good", score: 96 },
              },
            ],
            annotation: { score: 97, correct: true },
          },
        ],
        annotation: { score: 97, correct: true, all_correct: true },
      },
    },
  },
  {
    id: 3,
    word: "Dog",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    category: "animal",
    phonemes: ["D", "AO", "G"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Dog",
        quality_score: 85,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Dog",
            quality_score: 85,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "d",
                quality_score: 90,
                sound_most_like: "d",
                annotation: { correct: true, comment: "Good", score: 90 },
              },
              {
                phone: "ao",
                quality_score: 72,
                sound_most_like: "ao",
                annotation: {
                  correct: false,
                  comment: "Needs work",
                  score: 72,
                },
              },
              {
                phone: "g",
                quality_score: 93,
                sound_most_like: "g",
                annotation: { correct: true, comment: "Good", score: 93 },
              },
            ],
            annotation: { score: 85, correct: true },
          },
        ],
        annotation: { score: 85, correct: true, all_correct: false },
      },
    },
  },
  {
    id: 4,
    word: "Bank",
    image:
      "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=400&h=400&fit=crop",
    category: "object",
    phonemes: ["B", "AE", "NG", "K"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Bank",
        quality_score: 97,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Bank",
            quality_score: 97,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "b",
                quality_score: 89,
                sound_most_like: "b",
              },
              {
                phone: "ae",
                quality_score: 100,
                sound_most_like: "ae",
              },
              {
                phone: "ng",
                quality_score: 98,
                sound_most_like: "ng",
              },
              {
                phone: "k",
                quality_score: 100,
                sound_most_like: "k",
              },
            ],
          },
        ],
        annotation: { score: 97, correct: true, all_correct: true },
      },
    },
  },
  {
    id: 5,
    word: "Ball",
    image:
      "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400&h=400&fit=crop",
    category: "toy",
    phonemes: ["B", "AO", "L"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Ball",
        quality_score: 68,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Ball",
            quality_score: 68,
            quality_class: "fail",
            phone_score_list: [
              {
                phone: "b",
                quality_score: 85,
                sound_most_like: "b",
              },
              {
                phone: "ao",
                quality_score: 45,
                sound_most_like: "aa",
              },
              {
                phone: "l",
                quality_score: 74,
                sound_most_like: "l",
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: 6,
    word: "Fish",
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop",
    category: "animal",
    phonemes: ["F", "IH", "SH"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Fish",
        quality_score: 91,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Fish",
            quality_score: 91,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "f",
                quality_score: 94,
                sound_most_like: "f",
              },
              {
                phone: "ih",
                quality_score: 88,
                sound_most_like: "ih",
              },
              {
                phone: "sh",
                quality_score: 90,
                sound_most_like: "sh",
              },
            ],
          },
        ],
        annotation: { score: 91, correct: true, all_correct: true },
      },
    },
  },
  {
    id: 7,
    word: "Sun",
    image:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&h=400&fit=crop",
    category: "nature",
    phonemes: ["S", "AH", "N"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Sun",
        quality_score: 76,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Sun",
            quality_score: 76,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "s",
                quality_score: 60,
                sound_most_like: "s",
               
              },
              {
                phone: "ah",
                quality_score: 82,
                sound_most_like: "ah",
              },
              {
                phone: "n",
                quality_score: 86,
                sound_most_like: "n",
              },
            ],
            annotation: { score: 76, correct: true },
          },
        ],
        annotation: { score: 76, correct: true, all_correct: false },
      },
    },
  },
  {
    id: 8,
    word: "Bird",
    image:
      "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=400&fit=crop",
    category: "animal",
    phonemes: ["B", "ER", "D"],
    mockResponse: {
      status: "success",
      text_score: {
        text: "Bird",
        quality_score: 88,
        fidelity_class: "CORRECT",
        word_score_list: [
          {
            word: "Bird",
            quality_score: 88,
            quality_class: "pass",
            phone_score_list: [
              {
                phone: "b",
                quality_score: 92,
                sound_most_like: "b",
              },
              {
                phone: "er",
                quality_score: 80,
                sound_most_like: "er",
              },
              {
                phone: "d",
                quality_score: 91,
                sound_most_like: "d",
              },
            ],
            annotation: { score: 88, correct: true },
          },
        ],
        annotation: { score: 88, correct: true, all_correct: true },
      },
    },
  },
];
