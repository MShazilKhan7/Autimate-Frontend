import { twOption } from "@/lib/utils";

interface OptionCardProps {
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}
const OptionCard: React.FC<OptionCardProps> = ({ selected, onClick, disabled = false, children }) => (
    <div onClick={!disabled ? onClick : undefined} className={twOption(selected, disabled)}>
        {children}
    </div>
);

export default OptionCard;