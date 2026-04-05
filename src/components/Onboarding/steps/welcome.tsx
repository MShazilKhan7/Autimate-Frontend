import clsx from "clsx";
import { twH2 } from "@/lib/utils";
import { twSubtitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
    onNext: () => void;
    animatedCardTw: string;
    topRef: React.RefObject<HTMLDivElement>;
    commonPageWrapper: string;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, animatedCardTw, topRef, commonPageWrapper }) => (
    <div ref={topRef} className={commonPageWrapper}>
        <div className={clsx("max-w-2xl w-full", animatedCardTw, "text-center")}>
            <div className="text-5xl mb-4">🌟</div>
            <h1 className={clsx(twH2, "mb-3 bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent")}>
                Let's Set Up Your Child's Therapy
            </h1>
            <p className={clsx(twSubtitle, "text-sm p-2")}>
                This short assessment (about 5 minutes) uses evidence-based questionnaires to understand
                your child's communication level. We'll use it to personalize therapy experience from day one.
            </p>
            <div className="bg-primary/10 rounded-sm p-6 mb-6 text-left">
                <p className="m-0 text-[13px] text-[#5A6A8A] leading-[1.7]">
                    <strong>📋 Based on:</strong> MacArthur-Bates CDI, ADOS-2 communication domains,
                    GFTA-3 articulation norms, ASHA Functional Communication Measures, and Hryntsiv et al. (2025) ASD speech criteria.
                </p>
            </div>
            <div className="flex gap-2.5 justify-center mb-7 flex-wrap">
                {["~5 minutes", "7 sections", "Research-based", "Saved to profile"].map((t) => (
                    <span key={t} className="bg-primary/10 text-primary text-xs font-semibold py-[5px] px-[14px] rounded-full border border-[#C5DAFF]">
                        {t}
                    </span>
                ))}
            </div>
            <Button variant="default" size="lg" onClick={onNext}>Begin Assessment &rarr;</Button>
        </div>
    </div>
);

export default WelcomeStep;