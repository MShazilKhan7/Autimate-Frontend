import { AssessmentProfile } from "@/types/onboarding";
import { ChildInfo } from "@/types/onboarding";
import { twBtn, twCard, twH2, twSubtitle } from "@/lib/utils";
import { ScoreBar } from "@/components/Onboarding/scoreBar";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";


const ResultsStep: React.FC<{
    profile: AssessmentProfile;
    getChildInfo: () => ChildInfo;
    showDB: boolean;
    setShowDB: React.Dispatch<React.SetStateAction<boolean>>;
    resetAll: () => void;
    twCardCls: string;
    twH2Cls: string;
}> = ({
    profile, getChildInfo, showDB, setShowDB, resetAll, twCardCls, twH2Cls
}) => {
    const navigate = useNavigate();
    const { tier, scores, total } = profile;
    const childInfo = getChildInfo();
    const name = childInfo.name || "Your child";
    const dbOutput = JSON.stringify(profile.dbProfile, null, 2);
    const tierEmoji: Record<number, string> = { 1: "🌱", 2: "🌿", 3: "🌳", 4: "🚀", 5: "⭐" };
    const planItems = [
        { label: "Difficulty Level", value: tier.difficultyLevel, icon: "🎯" },
        { label: "Session Length", value: tier.sessionLength, icon: "⏱️" },
        { label: "Target Phonemes", value: tier.phonemeTargets.join(", "), icon: "🔤" },
        { label: "Vocabulary Target", value: tier.vocab, icon: "📚" },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0F4FF] to-[#F8F5FF] p-10 font-sans">
            <div className="max-w-[700px] mx-auto">
                {/* Header */}
                <div
                    className={clsx(twCardCls, "text-center mb-5 border-t-4")}
                    style={{ background: `linear-gradient(135deg, ${tier.bg}, #FFFFFF)`, borderTopColor: tier.color }}
                >
                    <div className="text-[52px] mb-2.5">{tierEmoji[tier.id]}</div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: tier.color }}>
                        Assessment Complete
                    </div>
                    <h2 className={clsx(twH2Cls, "text-[28px] mb-1.5")}>{name} is a</h2>
                    <div className="text-[26px] font-extrabold font-serif mb-3" style={{ color: tier.color }}>
                        {tier.label}
                    </div>
                    <div
                        className="inline-block"
                        style={{ background: tier.color, color: "#fff", borderRadius: 99, padding: "6px 22px", fontWeight: 700, fontSize: 15, marginBottom: 14 }}
                    >
                        Total Score: {total}/100
                    </div>
                    <p className={clsx(twSubtitle, "text-left bg-white rounded-xl px-4 py-3 border mb-0")} style={{ borderColor: `${tier.color}30` }}>
                        {tier.description}
                    </p>
                </div>
                {/* Domain Scores */}
                <div className={clsx(twCardCls, "mb-5")}>
                    <h3 className="font-serif text-lg text-foreground mt-0 mb-5">Communication Domain Scores</h3>
                    <ScoreBar label="🗣️ Expressive Language" score={scores.expressive} max={30} color="#4A90D9" />
                    <ScoreBar label="👂 Receptive Language" score={scores.receptive} max={20} color="#7B61FF" />
                    <ScoreBar label="🔊 Speech Articulation" score={scores.articulation} max={30} color="#F97316" />
                    <ScoreBar label="👋 Social Communication" score={scores.social} max={20} color="#22C55E" />
                </div>
                {/* Therapy Plan */}
                <div className={clsx(twCardCls, "mb-5")}>
                    <h3 className="font-serif text-lg text-foreground mt-0 mb-4">📋 Personalised Therapy Plan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {planItems.map((item) => (
                            <div key={item.label} className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl px-4 py-3.5">
                                <div className="text-[20px] mb-1.5">{item.icon}</div>
                                <div className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wide mb-1">{item.label}</div>
                                <div className="text-[14px] font-bold text-foreground">{item.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <div className="text-[13px] font-bold text-muted-foreground/80 mb-2.5">Recommended Starting Exercises:</div>
                        <div className="flex gap-2 flex-wrap">
                            {tier.exercises.map((ex) => (
                                <span key={ex} className="bg-primary/10 text-primary border border-primary/20 rounded-full py-1.5 px-3 text-[13px] font-semibold">
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                {/* DB Profile */}
                <div className={clsx(twCardCls, "mb-5")}>
                    <div className="flex justify-between items-center mb-3.5">
                        <h3 className="font-serif text-lg text-foreground m-0">💾 Database Profile Object</h3>
                        <Button variant="outline" size="lg" onClick={() => setShowDB((p) => !p)}>{showDB ? "Hide" : "Show JSON"}</Button>
                    </div>
                    <p className="text-[13px] text-muted-foreground/80 m-0">
                        This object is ready to be stored in your DB (e.g., MongoDB / PostgreSQL). It contains
                        all scoring data, tier classification, recommended exercises, phoneme targets, and preference settings.
                    </p>
                    {showDB && (
                        <div className="mt-3.5">
                            <div className="flex justify-end mb-1.5">
                                <button onClick={() => navigator.clipboard?.writeText(dbOutput)} className={clsx(twBtn(true), "text-xs py-1.5 px-3.5")}>
                                    Copy JSON
                                </button>
                            </div>
                            <pre className="bg-muted-foreground/10 text-muted-foreground/80 rounded-xl px-5 py-4.5 text-xs leading-[1.6] overflow-auto m-0 max-h-[400px] font-mono">
                                {dbOutput}
                            </pre>
                        </div>
                    )}
                </div>
                {/* Actions */}
                <div className="flex gap-3 justify-center flex-wrap">
                    <Button variant="default" size="lg" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                </div>
                <p className="text-center text-xs text-[#9CA3AF] mt-6 leading-[1.6]">
                    ⚠️ This assessment is a <strong>screening tool</strong> to personalise the platform
                    experience — it does not constitute a clinical diagnosis. Always involve a qualified
                    Speech-Language Pathologist for therapeutic decisions.
                </p>
            </div>
        </div>
    );
};

export default ResultsStep;