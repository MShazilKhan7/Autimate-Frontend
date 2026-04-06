import {
    AnswersMap,
    AssessmentProfile,
    CommunicationModeOption,
} from "@/types/onboarding";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { calculateProfile } from "@/lib/utils";
import WelcomeStep from "@/components/Onboarding/steps/welcome";
import ChildInfoStep from "@/components/Onboarding/steps/info";
import CommunicationModeStep from "@/components/Onboarding/steps/communicationMode";
import QuestionSectionStep, { DEFAULT_VALUES, FormValues } from "@/components/Onboarding/steps/questionSection";
import ResultsStep from "@/components/Onboarding/steps/result";
import { STEPS, STEP_KEYS, GENERIC_STEPS, TOTAL_PROGRESS_STEPS, twCard, twH2 } from "@/lib/constants/onboarding";
import { onboardingAPI, SubmitOnboardingRequest } from "@/api/onboarding";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export default function OnboardingAssessment() {
    const [currentStep, setCurrentStep] = useState(0);
    const [profile, setProfile] = useState<AssessmentProfile | null>(null);
    const [showDB, setShowDB] = useState(false);
    const [animIn, setAnimIn] = useState(true);
    const topRef = useRef<HTMLDivElement>(null);

    const { control, reset, watch, getValues } = useForm<FormValues>({
        defaultValues: DEFAULT_VALUES,
        mode: "onChange",
    });

    const stepKey = STEPS[currentStep].key;

    const { mutate: submitOnboarding, isPending: isSubmitting } = useMutation({
        mutationFn: onboardingAPI.submitOnboarding,
        onSuccess: () => {
            setCurrentStep(STEPS.findIndex((step) => step.key === STEP_KEYS.RESULT));
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        },
        onError: (error: any) => {
            console.log(error);
            toast({
                title: "Error",
                description: error.response.data.message,
                variant: "destructive",
            }); 
        }
    });

    // Navigation helpers
    const navigate = (dir: 1 | -1) => {
        setAnimIn(false);
        setTimeout(() => {
            setCurrentStep((prev) => prev + dir);
            setAnimIn(true);
            topRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };
    const onNext = () => navigate(1);
    const onPrev = () => navigate(-1);

    const handleComplete = () => {
        const values = getValues();
        const answersMap: AnswersMap = {
            communication_mode: values.communication_mode as CommunicationModeOption,
            expressive_language: values.expressive_language,
            receptive_language: values.receptive_language,
            articulation: values.articulation,
            social_pragmatics: values.social_pragmatics,
            sensory_engagement: values.sensory_engagement,
            caregiver_goals: values.caregiver_goals,
        };
        const computed = calculateProfile(answersMap);
        const request: SubmitOnboardingRequest = {
            name: values.childInfo.name,
            age: values.childInfo.age,
            diagnosis: values.childInfo.diagnosis,
            gender: values.childInfo.gender,
            profile: computed,
        };
        setProfile(computed);
        submitOnboarding(request);
    };

    const resetAll = () => {
        setCurrentStep(0);
        setProfile(null);
        setShowDB(false);
        reset(DEFAULT_VALUES);
    };

    // Animation
    const animatedCardTw = clsx(
        twCard,
        "transition-all duration-200",
        animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
    );
    const commonPageWrapper =
        "min-h-screen bg-gradient-to-br from-[#F0F4FF] to-[#F8F5FF] flex items-center justify-center p-6 font-sans";

    // Render steps using components
    if (stepKey === STEP_KEYS.WELCOME)
        return <WelcomeStep onNext={onNext} animatedCardTw={animatedCardTw} topRef={topRef} commonPageWrapper={commonPageWrapper} />;

    if (stepKey === STEP_KEYS.CHILD_INFO)
        return (
            <ChildInfoStep
                watch={watch}
                control={control}
                onNext={onNext}
                onPrev={onPrev}
                animatedCardTw={animatedCardTw}
                topRef={topRef}
                commonPageWrapper={commonPageWrapper}
                progressStep={1}
                totalProgress={TOTAL_PROGRESS_STEPS}
            />
        );

    if (stepKey === STEP_KEYS.COMMUNICATION_MODE)
        return (
            <CommunicationModeStep
                control={control}
                onNext={onNext}
                onPrev={onPrev}
                animatedCardTw={animatedCardTw}
                topRef={topRef}
                commonPageWrapper={commonPageWrapper}
                progressStep={2}
                totalProgress={TOTAL_PROGRESS_STEPS}
            />
        );

    // Generic question sections
    const questionSectionStepProps = {
        control,
        watch,
        onNext,
        onPrev,
        animatedCardTw,
        topRef,
        totalProgress: TOTAL_PROGRESS_STEPS,
        handleComplete,
    };

    const genericStepIndex = GENERIC_STEPS.findIndex(step => stepKey === step.key);
    if (genericStepIndex !== -1) {
        const step = GENERIC_STEPS[genericStepIndex];
        return (
            <QuestionSectionStep
                {...questionSectionStepProps}
                sectionKey={step.key}
                progressStep={genericStepIndex + 1}
            />
        );
    }

    if (stepKey === STEP_KEYS.RESULT && profile)
        return (
            <ResultsStep
                profile={profile}
                getChildInfo={() => getValues("childInfo")}
                showDB={showDB}
                setShowDB={setShowDB}
                resetAll={resetAll}
                twCardCls={twCard}
                twH2Cls={twH2}
            />
        );

    return <div>Something went wrong</div>;
}