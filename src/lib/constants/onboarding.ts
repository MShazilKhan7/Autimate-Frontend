import clsx from "clsx";

export const twCard = "bg-white border border-[#E8EDF5] rounded-[22px] px-9 py-8 shadow-[0_8px_32px_rgba(74,100,200,0.08)]";
export const twH2 = "text-3xl text-foreground font-bold m-0";
export const twSubtitle = "font-sans text-sm text-muted-foreground/80 my-2.5";
export const twBtn = (primary = false) =>
  clsx(
    "font-sans font-semibold text-[15px] py-3 px-7 rounded-xl transition-all duration-200",
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

export const STEP_KEYS = {
    WELCOME: "welcome",
    CHILD_INFO: "child_info",
    COMMUNICATION_MODE: "communication_mode",
    EXPRESSIVE_LANGUAGE: "expressive_language",
    RECEPTIVE_LANGUAGE: "receptive_language",
    ARTICULATION: "articulation",
    SOCIAL_PRAGMATICS: "social_pragmatics",
    SENSORY_ENGAGEMENT: "sensory_engagement",
    CAREGIVER_GOALS: "caregiver_goals",
    RESULT: "result",
};

export const STEPS = [
    {
        key: STEP_KEYS.WELCOME,
        title: "Welcome",
        subtitle: "This section helps us understand your child's information.",
        hasGenericQuestions: false,
    },
    {
        key: STEP_KEYS.CHILD_INFO,
        title: "Child Info",
        subtitle: "This section helps us understand your child's information.",
        hasGenericQuestions: false,
    },
    {
        key: STEP_KEYS.COMMUNICATION_MODE,
        title: "Communication Mode",
        subtitle: "This section helps us understand your child's communication mode.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.EXPRESSIVE_LANGUAGE,
        title: "Expressive Language",
        subtitle: "This section helps us understand your child's expressive language skills.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.RECEPTIVE_LANGUAGE,
        title: "Receptive Language",
        subtitle: "This section helps us understand your child's receptive language skills.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.ARTICULATION,
        title: "Articulation",
        subtitle: "This section helps us understand your child's articulation skills.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.SOCIAL_PRAGMATICS,
        title: "Social Pragmatics",
        subtitle: "This section helps us understand your child's social pragmatics skills.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.SENSORY_ENGAGEMENT,
        title: "Sensory Engagement",
        subtitle: "This section helps us understand your child's sensory engagement skills.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.CAREGIVER_GOALS,
        title: "Caregiver Goals",
        subtitle: "This section helps us understand your child's caregiver goals.",
        hasGenericQuestions: true,
    },
    {
        key: STEP_KEYS.RESULT,
        title: "Result",
        subtitle: "This section shows the result of the assessment.",
        hasGenericQuestions: false,
    },
];

export const GENERIC_STEPS = STEPS.filter(step => step.hasGenericQuestions);
export const TOTAL_PROGRESS_STEPS = GENERIC_STEPS.length;