interface ScoreBarProps {
    label: string; 
    score: number; 
    max: number; 
    color: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ label, score, max, color }) => (
    <div className="mb-3.5">
        <div className="flex justify-between text-[13px] font-sans text-[#4A5568] mb-1.5">
            <span>{label}</span>
            <span className="font-bold" style={{ color }}>{score}/{max}</span>
        </div>
        <div className="bg-[#E8EDF5] rounded-full h-2 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(score / max) * 100}%`, background: color }}
            />
        </div>
    </div>
);