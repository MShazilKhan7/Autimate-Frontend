import clsx from "clsx";
import { twH2 } from "@/lib/utils";
import { twSubtitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { QUESTIONS } from "@/lib/constant";
import ProgressBar from "@/components/Onboarding/progressBar";
import { ResearchBadge } from "@/components/Onboarding/badges";
import OptionCard from "@/components/Onboarding/optionCard";
import { ChildInfo, CommunicationModeOption, ExpressiveLanguageSubQuestion, ReceptiveLanguageSubQuestion, ArticulationSubQuestion, SocialPragmaticsSubQuestion, SensoryEngagementSubQuestion, CaregiverGoalsSubQuestion, SectionAnswerMap, SectionWithQuestions } from "@/types/onboarding";
import { MultiselectQuestion, MultiselectPrefQuestion, QuestionOption } from "@/types/onboarding";

export interface FormValues {
    childInfo: ChildInfo;
    communication_mode: CommunicationModeOption | null;
    expressive_language: SectionAnswerMap;
    receptive_language: SectionAnswerMap;
    articulation: SectionAnswerMap;
    social_pragmatics: SectionAnswerMap;
    sensory_engagement: SectionAnswerMap;
    caregiver_goals: SectionAnswerMap;
}

export const DEFAULT_VALUES: FormValues = {
    childInfo: { name: "", age: "", diagnosis: "", gender: 0 },
    communication_mode: null,
    expressive_language: {},
    receptive_language: {},
    articulation: {},
    social_pragmatics: {},
    sensory_engagement: {},
    caregiver_goals: {},
};

const sectionKeys = [
    "expressive_language",
    "receptive_language",
    "articulation",
    "social_pragmatics",
    "sensory_engagement",
    "caregiver_goals",
];

interface QuestionSectionProps {
    sectionKey: (typeof sectionKeys)[number];
    control: any;
    watch: any;
    onNext: () => void;
    onPrev: () => void;
    animatedCardTw: string;
    topRef: React.RefObject<HTMLDivElement>;
    progressStep: number;
    totalProgress: number;
    handleComplete?: () => void;
}

const QuestionSectionStep: React.FC<QuestionSectionProps> = ({
    sectionKey, control, watch, onNext, onPrev, animatedCardTw, topRef, progressStep, totalProgress, handleComplete
}) => {
    const section = QUESTIONS[sectionKey] as SectionWithQuestions<
        | ExpressiveLanguageSubQuestion
        | ReceptiveLanguageSubQuestion
        | ArticulationSubQuestion
        | SocialPragmaticsSubQuestion
        | SensoryEngagementSubQuestion
        | CaregiverGoalsSubQuestion
    >;

    const isFinalSection = sectionKey === "caregiver_goals";
    const isOptionalSection = sectionKey === "sensory_engagement";

    // Watch the whole section object to derive isAllAnswered reactively
    const sectionValues = watch(sectionKey) as SectionAnswerMap ?? {};

    const allAnswered =
        isOptionalSection ||
        isFinalSection ||
        section.questions.every((q) => {
            if (q.type === "multiselect_pref" || q.type === "single_pref") return true;
            return sectionValues[q.id] !== undefined;
        });

    return (
        <div ref={topRef} className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-[#F8F5FF] p-10 font-sans">
            <div className={clsx("max-w-[640px] mx-auto", animatedCardTw)}>
                <ProgressBar step={progressStep} total={totalProgress} />
                <ResearchBadge text={section.research} />
                <h2 className={twH2}>{section.title}</h2>
                <p className={twSubtitle}>{section.subtitle}</p>

                {section.questions.map((q, qi) => {
                    const fieldName = `${sectionKey}.${q.id}` as const;

                    // multiselect
                    if (q.type === "multiselect") {
                        return (
                            <div key={q.id} className="mb-7">
                                <p className="font-semibold text-[#1A2040] text-[15px] mb-2.5">
                                    {qi + 1}. {q.text}
                                </p>
                                <Controller
                                    control={control}
                                    name={fieldName as any}
                                    defaultValue={[]}
                                    render={({ field }) => {
                                        const selected = (field.value as QuestionOption<number>[]) ?? [];
                                        return (
                                            <>
                                                {(q as MultiselectQuestion).options.map((opt) => {
                                                    const isSel = selected.some((s) => s.label === opt.label);
                                                    return (
                                                        <OptionCard
                                                            key={opt.label}
                                                            selected={isSel}
                                                            onClick={() => {
                                                                const next = isSel
                                                                    ? selected.filter((s) => s.label !== opt.label)
                                                                    : [...selected, opt];
                                                                field.onChange(next);
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={clsx(
                                                                    "w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center flex-shrink-0",
                                                                    isSel ? "border-[#4A90D9] bg-[#4A90D9]" : "border-[#CBD5E0] bg-transparent",
                                                                )}>
                                                                    {isSel && <span className="text-white text-xs leading-none">✓</span>}
                                                                </div>
                                                                <span className="font-semibold text-[#1A2040] text-[14px]">{opt.label}</span>
                                                            </div>
                                                        </OptionCard>
                                                    );
                                                })}
                                            </>
                                        );
                                    }}
                                />
                            </div>
                        );
                    }
                    // multiselect_pref
                    if (q.type === "multiselect_pref") {
                        return (
                            <div key={q.id} className="mb-7">
                                <p className="font-semibold text-[#1A2040] text-[15px] mb-2.5">
                                    {qi + 1}. {q.text}
                                </p>
                                <Controller
                                    control={control}
                                    name={fieldName as any}
                                    defaultValue={[]}
                                    render={({ field }) => {
                                        const selected = (field.value as string[]) ?? [];
                                        return (
                                            <div className="flex flex-wrap gap-2">
                                                {(q as MultiselectPrefQuestion).options.map((opt) => {
                                                    const key = opt.val ?? opt.label;
                                                    const isSel = selected.includes(key);
                                                    return (
                                                        <span
                                                            key={key}
                                                            onClick={() => {
                                                                const next = isSel
                                                                    ? selected.filter((s) => s !== key)
                                                                    : [...selected, key];
                                                                field.onChange(next);
                                                            }}
                                                            className={clsx(
                                                                "py-2.5 px-4 rounded-full text-[14px] cursor-pointer transition-all duration-150",
                                                                isSel
                                                                    ? "border-2 border-[#4A90D9] bg-[#EEF5FF] text-[#2563C0] font-bold"
                                                                    : "border-2 border-[#E2E8F0] bg-[#FAFBFD] text-[#6B7A99]",
                                                            )}
                                                        >
                                                            {opt.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        );
                    }
                    // single / scale / frequency / single_pref
                    return (
                        <div key={q.id} className="mb-7">
                            <p className="font-semibold text-[#1A2040] text-[15px] mb-2.5">
                                {qi + 1}. {q.text}
                            </p>
                            <Controller
                                control={control}
                                name={fieldName as any}
                                render={({ field }) => (
                                    <>
                                        {q.options.map((opt) => {
                                            // Always use unique optKey for all types
                                            const optKey = (opt as any).val ?? opt.label;
                                            let isSel: boolean = false;
                                            if (q.type === "single_pref" || q.type === "scale") {
                                                isSel = field.value === optKey;
                                            } else {
                                                isSel = (field.value as QuestionOption<number> | undefined)?.label === opt.label;
                                            }
                                            return (
                                                <OptionCard
                                                    key={optKey}
                                                    selected={isSel}
                                                    onClick={() => {
                                                        let stored: any;
                                                        if (q.type === "single_pref" || q.type === "scale") {
                                                            stored = optKey;
                                                        } else {
                                                            stored = opt;
                                                        }
                                                        field.onChange(stored);
                                                    }}
                                                >
                                                    <span
                                                        className={clsx(
                                                            "font-sans text-[14px]",
                                                            isSel ? "font-bold text-[#2563C0]" : "font-normal text-[#1A2040]"
                                                        )}
                                                    >
                                                        {opt.label}
                                                    </span>
                                                </OptionCard>
                                            );
                                        })}
                                    </>
                                )}
                            />
                        </div>
                    );
                })}

                {/* Nav */}
                <div className="flex justify-between mt-2">
                    <Button variant="outline" size="lg" onClick={onPrev}>&larr; Back</Button>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={isFinalSection && handleComplete ? handleComplete : onNext}
                        disabled={!allAnswered}
                    >
                        {isFinalSection ? "See Results 🎉" : "Next →"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuestionSectionStep;