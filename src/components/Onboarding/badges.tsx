interface ResearchBadgeProps { text: string }
export const ResearchBadge: React.FC<ResearchBadgeProps> = ({ text }) => (
    <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-[11px] text-primary font-sans mb-5 max-w-full">
        <span className="text-[12px]">🔬</span>
        <span className="italic">{text}</span>
    </div>
);