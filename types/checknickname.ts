import { CategoryData } from "./category";

// Types
export interface NicknameResult {
    success: boolean;
    game?: string;
    id?: number;
    server?: number;
    region?: string;
    name?: string;
    message?: string;
}

interface ServerOption {
    name: string;
    value: string;
}

export type ServerData = string[] | ServerOption[];

export interface PlaceholderContentProps {
    userId?: string;
    serverId?: string;
    onChangeUserId?: (value: string) => void;
    onChangeServerId?: (value: string) => void;
    category: CategoryData;
    serverData?: ServerData;
}

export interface UserInputFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    showTooltip?: boolean;
}

export interface ServerInputFieldProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    showTooltip?: boolean;
}

export interface ServerSelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    serverData: ServerData;
    showTooltip?: boolean;
}

export interface NicknameDisplayProps {
    isLoading: boolean;
    nicknameData: NicknameResult | null;
}