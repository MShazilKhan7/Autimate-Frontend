import clsx from "clsx";
import { twH2 } from "@/lib/utils";
import { twSubtitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { QUESTIONS } from "@/lib/constant";
import ProgressBar from "@/components/Onboarding/progressBar";
import { ResearchBadge } from "@/components/Onboarding/badges";
import OptionCard from "@/components/Onboarding/optionCard";
interface CommunicationModeStepProps {
    control: any;
    onNext: () => void;
    onPrev: () => void;
    animatedCardTw: string;
    topRef: React.RefObject<HTMLDivElement>;
    commonPageWrapper: string;
    progressStep: number;
    totalProgress: number;
}

const CommunicationModeStep: React.FC<CommunicationModeStepProps> = ({
    control, onNext, onPrev, animatedCardTw, topRef, commonPageWrapper, progressStep, totalProgress
}) => {
    const q = QUESTIONS.communication_mode;
    return (
        <div ref={topRef} className={clsx(commonPageWrapper, "items-start pt-10")}>
            <div className={clsx("max-w-[580px] w-full", animatedCardTw)}>
                <ProgressBar step={progressStep} total={totalProgress} />
                <ResearchBadge text={q.research} />
                <h2 className={twH2}>{q.title}</h2>
                <p className={twSubtitle}>{q.subtitle}</p>
                <Controller
                    control={control}
                    name="communication_mode"
                    render={({ field }) => (
                        <>
                            {q.options.map((opt) => {
                                const sel = field.value?.id === opt.id;
                                return (
                                    <OptionCard key={opt.id} selected={sel} onClick={() => field.onChange(opt)}>
                                        <div className="font-sans">
                                            <div className={clsx("font-bold text-[15px]", sel ? "text-[#2563C0]" : "text-[#1A2040]")}>
                                                {opt.label}
                                            </div>
                                            <div className="text-[13px] text-[#6B7A99] mt-1">{opt.sub}</div>
                                        </div>
                                    </OptionCard>
                                );
                            })}
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" size="lg" onClick={onPrev}>&larr; Back</Button>
                                <Button variant="default" size="lg" onClick={onNext} disabled={!field.value}>Next &rarr;</Button>
                            </div>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default CommunicationModeStep;