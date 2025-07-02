import { ServerInputFieldProps, ServerSelectFieldProps, UserInputFieldProps } from "@/types/checknickname";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// Sub-components
export const FieldLabel = ({
    label,
    showTooltip = false,
    tooltipText
}: {
    label: string;
    showTooltip?: boolean;
    tooltipText?: string;
}) => (
    <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
        {label}
        {showTooltip && (
            <span className="tooltip" title={tooltipText}>
                <Info size={16} className="text-gray-400" />
            </span>
        )}
    </label>
);

export const UserInputField = ({
    label,
    value,
    onChange,
    placeholder,
    showTooltip = false
}: UserInputFieldProps) => (
    <div className="flex flex-col space-y-2 w-full">
        <FieldLabel
            label={label}
            showTooltip={showTooltip && label === "User ID"}
            tooltipText="Enter your User ID"
        />
        <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
        />
    </div>
);

export const ServerInputField = ({
    label,
    value,
    onChange,
    placeholder,
    showTooltip = false
}: ServerInputFieldProps) => (
    <div className="flex flex-col space-y-2 w-full">
        <FieldLabel
            label={label}
            showTooltip={showTooltip && label === "Server"}
            tooltipText="Enter your Server ID"
        />
        <Input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full rounded-lg px-2 py-1 placeholder:text-gray-500 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900"
        />
    </div>
);

export const ServerSelectField = ({
    label,
    value,
    onChange,
    placeholder,
    serverData,
    showTooltip = false
}: ServerSelectFieldProps) => (
    <div className="flex flex-col space-y-2 w-full">
        <FieldLabel
            label={label}
            showTooltip={showTooltip && label === "Server"}
            tooltipText="Enter your Server ID"
        />
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full rounded-lg px-2 py-1 text-white border-2 border-blue-500 focus-visible:ring-0 focus-visible:border-blue-900">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-[#0a192f] border-blue-700">
                {serverData.map((server, index) => {
                    const serverValue = typeof server === "string" ? server : server.value;
                    const serverLabel = typeof server === "string" ? server : server.name;

                    return (
                        <SelectItem
                            key={index}
                            value={serverValue}
                            className="text-white hover:bg-blue-800"
                        >
                            {serverLabel}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    </div>
);