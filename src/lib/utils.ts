import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnswersMap, AssessmentProfile, Preferences, CommunicationModeOption, SectionAnswerMap, QuestionOption, DomainScores } from "@/types/onboarding";
import { TIERS } from "@/lib/constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProfile(answers: AnswersMap): AssessmentProfile {
  let expressive = 0;
  let receptive = 0;
  let articulation = 0;
  let social = 0;
  const preferences: Preferences = { motivators: [], sensitivities: [], reward: "celebration" };

  const commMode = answers.communication_mode as CommunicationModeOption | undefined;
  if (commMode?.score) {
    expressive += commMode.score.expressive;
    receptive += commMode.score.receptive;
  }

  const expressiveSection = answers.expressive_language as SectionAnswerMap | undefined;
  if (expressiveSection) {
    Object.values(expressiveSection).forEach((v) => {
      if (v && typeof v === "object" && !Array.isArray(v) && "score" in v) {
        expressive += (v as QuestionOption<number>).score ?? 0;
      }
    });
  }

  const receptiveSection = answers.receptive_language as SectionAnswerMap | undefined;
  if (receptiveSection) {
    Object.values(receptiveSection).forEach((v) => {
      if (v && typeof v === "object" && !Array.isArray(v) && "score" in v) {
        receptive += (v as QuestionOption<number>).score ?? 0;
      }
    });
  }

  const articulationSection = answers.articulation as SectionAnswerMap | undefined;
  if (articulationSection) {
    Object.values(articulationSection).forEach((v) => {
      if (Array.isArray(v)) {
        const best = (v as QuestionOption<number>[]).reduce(
          (a, b) => ((a.score ?? 0) > (b.score ?? 0) ? a : b),
          { score: 0 } as QuestionOption<number>
        );
        articulation += best.score ?? 0;
      } else if (v && typeof v === "object" && "score" in v) {
        articulation += (v as QuestionOption<number>).score ?? 0;
      }
    });
  }

  const socialSection = answers.social_pragmatics as SectionAnswerMap | undefined;
  if (socialSection) {
    Object.values(socialSection).forEach((v) => {
      if (v && typeof v === "object" && !Array.isArray(v) && "score" in v) {
        social += (v as QuestionOption<number>).score ?? 0;
      }
    });
  }

  const sensorySection = answers.sensory_engagement as SectionAnswerMap | undefined;
  if (sensorySection) {
    if (Array.isArray(sensorySection.motivators)) {
      preferences.motivators = sensorySection.motivators.map((m) => m.label);
    }
    if (Array.isArray(sensorySection.sensory_sensitivity)) {
      preferences.sensitivities = sensorySection.sensory_sensitivity.map((s) => s.label);
    }
    if (typeof sensorySection.reward_type === "string") {
      preferences.reward = sensorySection.reward_type;
    }
  }

  const EX_MAX = 30, RE_MAX = 20, AR_MAX = 30, SO_MAX = 20;
  const normExp = Math.min((expressive / EX_MAX) * 30, 30);
  const normRec = Math.min((receptive / RE_MAX) * 20, 20);
  const normArt = Math.min((articulation / AR_MAX) * 30, 30);
  const normSoc = Math.min((social / SO_MAX) * 20, 20);
  const total = Math.round(normExp + normRec + normArt + normSoc);

  const tier = TIERS.find((t) => total >= t.range[0] && total <= t.range[1]) ?? TIERS[0];

  const goalsSection = answers.caregiver_goals as SectionAnswerMap | undefined;
  const primaryGoal = (goalsSection?.primary_goal as string) ?? "overall";
  const therapistStatus = (goalsSection?.therapist_involvement as string) ?? "no_slp";
  const homePractice = (goalsSection?.home_practice as string) ?? "10_20min";

  const scores: DomainScores = {
    expressive: Math.round(normExp),
    receptive: Math.round(normRec),
    articulation: Math.round(normArt),
    social: Math.round(normSoc),
  };

  return {
    scores,
    total,
    tier,
    preferences,
    primaryGoal,
    therapistStatus,
    homePractice,
    dbProfile: {
      tierId: tier.id,
      tierLabel: tier.label,
      scores,
      totalScore: total,
      difficultyLevel: tier.difficultyLevel,
      targetPhonemes: tier.phonemeTargets,
      recommendedExercises: tier.exercises,
      sessionLengthTarget: tier.sessionLength,
      preferences,
      primaryGoal,
      assessmentDate: new Date().toISOString(),
    },
  };
}

export const twCard = "bg-white border border-[#E8EDF5] rounded-[22px] px-9 py-8 shadow-[0_8px_32px_rgba(74,100,200,0.08)]";
export const twH2 = "text-2xl text-[#1A2040] font-bold m-0";
export const twSubtitle = "text-sm text-[#6B7A99] my-2.5 leading-[1.5]";
export const twBtn = (primary = false) =>
  clsx(
    "font-semibold text-[15px] py-3 px-7 rounded-xl transition-all duration-200",
    primary
      ? "bg-gradient-to-tr from-[#4A90D9] to-[#7B61FF] text-white border-none shadow-[0_4px_14px_rgba(74,144,217,0.35)]"
      : "bg-white text-[#6B7A99] border-2 border-[#E2E8F0]"
  );

export const twOption = (selected: boolean, disabled = false) =>
  clsx(
    "rounded-[14px] py-3.5 px-4 mb-2 cursor-pointer select-none transition-all duration-150",
    selected
      ? "border-2 border-[#4A90D9] bg-[#EEF5FF] scale-[1.01] shadow-[0_4px_16px_rgba(74,144,217,0.18)]"
      : "border-2 border-[#E2E8F0] bg-[#FAFBFD] scale-100 shadow",
    disabled && "cursor-default opacity-50"
  );