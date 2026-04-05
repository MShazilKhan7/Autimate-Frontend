import clsx from "clsx";
import { twH2 } from "@/lib/utils";
import { twSubtitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { QuestionOption } from "@/types/onboarding";
import ProgressBar from "@/components/Onboarding/progressBar";
import { InputField, ChipsField } from "@/components/Onboarding/inputs";

interface ChildInfoStepProps {
    control: any;
    watch: any;
    onNext: () => void;
    onPrev: () => void;
    animatedCardTw: string;
    topRef: React.RefObject<HTMLDivElement>;
    commonPageWrapper: string;
    progressStep: number;
    totalProgress: number;
}

const diagnoses: Array<QuestionOption<number, string>> = [{ label: "ASD", val: "ASD" }, { label: "ASD + ADHD", val: "ASD + ADHD" }, { label: "Speech Delay", val: "Speech Delay" }, { label: "DLD", val: "DLD" }, { label: "Other", val: "Other" }, { label: "Prefer not to say", val: "Prefer not to say" }];
const genderOptions: Array<QuestionOption<number, string | number>> = [
    { label: "Female", val: 0 },
    { label: "Male", val: 1 },
];

const ChildInfoStep: React.FC<ChildInfoStepProps> = ({
    control, watch, onNext, onPrev, animatedCardTw, topRef, commonPageWrapper, progressStep, totalProgress
}) => {


    const isDisabled = !watch("childInfo.name") || !watch("childInfo.age") || !watch("childInfo.diagnosis");

    return (
        <div ref={topRef} className={commonPageWrapper}>
            <div className={clsx("max-w-2xl w-full", animatedCardTw)}>
                <ProgressBar step={progressStep} total={totalProgress} />
                <h2 className={clsx(twH2, "text-primary")}>About Your Child</h2>
                <p className={twSubtitle}>This helps us address them correctly throughout the platform.</p>

                <div className="flex flex-col gap-3.5 p-2">
                    {/* Name */}
                    <InputField control={control} name="childInfo.name" label="Child's first name" placeholder="e.g. Ali" type="text" required={true} />
                    {/* Age */}
                    <InputField control={control} name="childInfo.age" label="Age (years)" placeholder="e.g. 5" type="number" required={true} />
                    {/* Diagnosis chips */}
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground/80 font-sans block mb-2">
                            ASD or other diagnosis (optional)
                        </label>
                        <Controller
                            control={control}
                            name="childInfo.diagnosis"
                            render={({ field }) => (
                                <ChipsField field={field} options={diagnoses} />
                            )}
                        />
                    </div>
                    {/* Gender chips */}
                    <div>
                        <label className="text-sm font-semibold text-muted-foreground/80 font-sans block mb-2">
                            Gender
                        </label>
                        <Controller
                            control={control}
                            name="childInfo.gender"
                            render={({ field }) => (
                                <ChipsField
                                    field={field}
                                    options={genderOptions}
                                />
                            )}
                        />
                    </div>
                </div>
                {/* Nav */}
                <Controller
                    control={control}
                    name="childInfo"
                    render={() => (
                        <div className="flex justify-between mt-7">
                            <Button variant="outline" size="lg" onClick={onPrev}>&larr; Back</Button>
                            <Button variant="default" size="lg" onClick={onNext} disabled={isDisabled}>Next &rarr;</Button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default ChildInfoStep;