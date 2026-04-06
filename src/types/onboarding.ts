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

export interface QuestionOption<TScore = number, TValue = string> {
  id?: string;
  label: string;
  sub?: string;
  score?: TScore;
  val?: TValue;
}

export interface ExpressiveReceptiveScore {
  expressive: number;
  receptive: number;
}

export type CommunicationModeOption = QuestionOption<ExpressiveReceptiveScore>;

export interface CommunicationModeQuestion {
  title: string;
  subtitle: string;
  research: string;
  type: "single";
  options: CommunicationModeOption[];
}

export type ScaleOption = QuestionOption<number>;
export type FrequencyOption = QuestionOption<number>;
export type MultiselectArticulationOption = QuestionOption<number>;
export type MultiselectPrefOption = QuestionOption<undefined, string>;
export type SinglePrefOption = QuestionOption<undefined, string>;

export interface BaseSubQuestion {
  id: string;
  text: string;
}

export interface ScaleQuestion extends BaseSubQuestion {
  type: "scale";
  options: ScaleOption[];
}

export interface FrequencyQuestion extends BaseSubQuestion {
  type: "frequency";
  options: FrequencyOption[];
}

export interface SingleQuestion extends BaseSubQuestion {
  type: "single";
  options: QuestionOption<number>[];
}

export interface MultiselectQuestion extends BaseSubQuestion {
  type: "multiselect";
  options: MultiselectArticulationOption[];
  maxScore: number;
}

export interface MultiselectPrefQuestion extends BaseSubQuestion {
  type: "multiselect_pref";
  options: MultiselectPrefOption[];
}

export interface SinglePrefQuestion extends BaseSubQuestion {
  type: "single_pref";
  options: SinglePrefOption[];
}

export type ExpressiveLanguageSubQuestion = ScaleQuestion | FrequencyQuestion;
export type ReceptiveLanguageSubQuestion = ScaleQuestion | FrequencyQuestion;
export type ArticulationSubQuestion = ScaleQuestion | SingleQuestion | MultiselectQuestion;
export type SocialPragmaticsSubQuestion = FrequencyQuestion;
export type SensoryEngagementSubQuestion = ScaleQuestion | MultiselectPrefQuestion | SinglePrefQuestion;
export type CaregiverGoalsSubQuestion = SinglePrefQuestion;

export interface SectionWithQuestions<TQuestion> {
  title: string;
  subtitle: string;
  research: string;
  questions: TQuestion[];
}

export interface OnboardingQuestions {
  communication_mode: CommunicationModeQuestion;
  expressive_language: SectionWithQuestions<ExpressiveLanguageSubQuestion>;
  receptive_language: SectionWithQuestions<ReceptiveLanguageSubQuestion>;
  articulation: SectionWithQuestions<ArticulationSubQuestion>;
  social_pragmatics: SectionWithQuestions<SocialPragmaticsSubQuestion>;
  sensory_engagement: SectionWithQuestions<SensoryEngagementSubQuestion>;
  caregiver_goals: SectionWithQuestions<CaregiverGoalsSubQuestion>;
}

export interface Tier {
  id: 1 | 2 | 3 | 4 | 5;
  label: string;
  range: [number, number];
  color: string;
  bg: string;
  description: string;
  phonemeTargets: string[];
  vocab: string;
  sessionLength: string;
  exercises: string[];
  difficultyLevel: string;
}

export interface ChildInfo {
  name: string;
  age: string;
  diagnosis: string;
  gender: 0 | 1;
}

export interface Preferences {
  motivators: string[];
  sensitivities: string[];
  reward: string;
}

export interface DomainScores {
  expressive: number;
  receptive: number;
  articulation: number;
  social: number;
}

export interface DBProfile {
  tierId: number;
  tierLabel: string;
  scores: DomainScores;
  totalScore: number;
  difficultyLevel: string;
  targetPhonemes: string[];
  recommendedExercises: string[];
  sessionLengthTarget: string;
  preferences: Preferences;
  primaryGoal: string;
  assessmentDate: string;
}

export interface AssessmentProfile {
  scores: DomainScores;
  total: number;
  tier: Tier;
  preferences: Preferences;
  primaryGoal: string;
  therapistStatus: string;
  homePractice: string;
  dbProfile: DBProfile;
}

export type SectionAnswerMap = Record<string, QuestionOption | QuestionOption[] | string | string[]>;
export type AnswersMap = Record<string, SectionAnswerMap | CommunicationModeOption | undefined>;