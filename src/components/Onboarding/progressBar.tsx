interface ProgressBarProps { step: number; total: number }

const ProgressBar: React.FC<ProgressBarProps> = ({ step, total }) => {
    const pct = Math.round((step / total) * 100);
    return (
        <div className="mb-7">
            <div className="flex justify-between text-xs text-muted-foreground/80 mb-1.5 font-sans">
                <span>Step {step} of {total}</span>
                <span>{pct}% complete</span>
            </div>
            <div className="bg-muted-foreground/20 rounded-full h-1.5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-primary to-primary/80"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;