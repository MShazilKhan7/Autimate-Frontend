import { Controller } from "react-hook-form";
import { QuestionOption } from "@/types/onboarding";
import clsx from "clsx";

export const InputField: React.FC<{
    control: any;
    name: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
}> = ({ control, name, label, placeholder, type, required = true }) => {
    return (
        <div>
            <label className="text-sm font-semibold text-muted-foreground/80 font-sans block mb-1.5">
                {label}
            </label>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <input
                        {...field}
                        required={required}
                        type={type}
                        placeholder={placeholder}
                        className="w-full py-3 px-3.5 border-2 border-[#E2E8F0] rounded-xl text-[15px] font-sans outline-none bg-[#FAFBFD]"
                    />
                )}
            />
        </div>
    );
};

export const ChipsField: React.FC<{
    field: any;
    options: QuestionOption<number, string | number>[];
}> = ({ field, options }) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {options.map((opt) => {
                const sel = field.value === opt.val;
                return (
                    <span
                        key={opt.val}
                        onClick={() => field.onChange(opt.val)}
                        className={clsx(
                            "py-2 px-3.5 rounded-full text-[13px] font-sans transition-all duration-150 cursor-pointer",
                            sel
                                ? "border-2 border-[#4A90D9] bg-[#EEF5FF] text-[#2563C0] font-bold"
                                : "border-2 border-[#E2E8F0] bg-[#FAFBFD] text-[#6B7A99]",
                        )}
                    >
                        {opt.label}
                    </span>
                );
            })}
        </div>
    )
}