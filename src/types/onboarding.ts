interface Answer {
  _id: string;
  answerText: string;
  createdAt: string; // or Date if you convert it
}

export interface QuestionWithAnswers {
  _id: string;
  questionText: string;
  createdAt: string; // or Date
  answers: Answer[];
}
