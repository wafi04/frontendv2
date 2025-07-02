"use client";

import React, { useState, useEffect } from "react";
import { Info, Loader2, XCircle } from "lucide-react";
import { CategoryData } from "@/types/category";
import { useParams } from "next/navigation";
import { useOrderStore } from "@/hooks/useOrderStore";
import { CheckNickname } from "@/lib/check-nickname";
import { NicknameDisplayProps, NicknameResult, PlaceholderContentProps } from "@/types/checknickname";
import { shouldShowSecondInput, shouldUseDropdown } from "@/utils/hasServerId";
import { ServerInputField, ServerSelectField, UserInputField } from "./nicknameComponent";

const LoadingState = () => (
    <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        <span className="text-gray-300">Checking nickname...</span>
    </div>
);

const SuccessState = ({ nicknameData }: { nicknameData: NicknameResult }) => (
    <div className="text-sm">
        <span className="text-gray-400">Your account is </span>
        <span className="font-bold text-green-300">
            {nicknameData.name}
        </span>
        {nicknameData.region && (
            <>
                <span className="text-gray-400"> from </span>
                <span className="text-green-300">
                    {nicknameData.region}
                </span>
            </>
        )}
    </div>
);

const ErrorState = ({ nicknameData }: { nicknameData: NicknameResult | null }) => (
    <div className="text-sm flex gap-3">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="text-red-400 font-medium">
            Account tidak ditemukan
        </span>
        <span className="text-red-100 text-sm">
            {nicknameData?.message || "Tolong Check User ID and Server ID"}
        </span>
    </div>
);

const NicknameDisplay = ({ isLoading, nicknameData }: NicknameDisplayProps) => {
    if (!isLoading && !nicknameData) return null;

    return (
        <div className="px-4 pb-4">
            <div className="bg-card rounded-2xl py-2 px-4">
                {isLoading ? (
                    <LoadingState />
                ) : nicknameData?.success ? (
                    <SuccessState nicknameData={nicknameData} />
                ) : (
                    <ErrorState nicknameData={nicknameData} />
                )}
            </div>
        </div>
    );
};

// Custom Hook for nickname validation
const useNicknameValidation = (category: CategoryData, userId: string, serverId: string) => {
    const [nicknameData, setNicknameData] = useState<NicknameResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { setNickName, setCheck } = useOrderStore();

    const checkNickname = async () => {
        if (category.code && userId && category.isCheckNickname === "active") {
            setIsLoading(true);
            setCheck({ isChecking: true, withoutCheking: false });

            try {
                const data = await CheckNickname({
                    data: {
                        game: category.code,
                        userId: parseInt(userId),
                        zone: serverId
                    }
                });

                console.log(data);
                setNickName(data.name || data.message || "Username validated");
                setNicknameData(data);
            } catch (error: any) {
                setNickName(undefined);
                setNicknameData({
                    success: false,
                    message: error.message || "Unable to validate nickname",
                });
            } finally {
                setIsLoading(false);
                setCheck({ isChecking: false, withoutCheking: false });
            }
        }
    };

    return { nicknameData, isLoading, checkNickname };
};



// Main Component
export function PlaceholderContent({
    category,
    onChangeServerId,
    onChangeUserId,
    serverId = "",
    userId = "",
    serverData,
}: PlaceholderContentProps) {
    const hasSecondInput = shouldShowSecondInput(category);
    const useDropdown = shouldUseDropdown(hasSecondInput, serverData);

    const { nicknameData, isLoading, checkNickname } = useNicknameValidation(
        category,
        userId,
        serverId
    );

    // Event handlers
    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeUserId?.(e.target.value);
    };

    const handleServerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeServerId?.(e.target.value);
    };

    const handleServerSelectChange = (value: string) => {
        onChangeServerId?.(value);
    };

    // Effects
    useEffect(() => {
        if (
            category.isCheckNickname &&
            userId &&
            (hasSecondInput ? serverId : true) &&
            category.code
        ) {
            const timeoutId = setTimeout(() => {
                checkNickname();
            }, 1500);

            return () => clearTimeout(timeoutId);
        } else if (!category.isCheckNickname) {
            const { setNickName, setCheck } = useOrderStore.getState();
            setCheck({ isChecking: false, withoutCheking: true });
            setNickName(undefined);
        }
    }, [userId, serverId, category.code, category.isCheckNickname]);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between space-y-4 p-4 md:space-y-0 gap-4">
                <UserInputField
                    label={category.placeholder1}
                    value={userId}
                    onChange={handleUserIdChange}
                    placeholder={category.placeholder1}
                    showTooltip={category.placeholder1 === "User ID"}
                />

                {hasSecondInput && (
                    <>
                        {useDropdown ? (
                            <ServerSelectField
                                label={category.placeholder2}
                                value={serverId}
                                onChange={handleServerSelectChange}
                                placeholder={`Pilih ${category.placeholder2}`}
                                serverData={serverData!}
                                showTooltip={category.placeholder2 === "Server"}
                            />
                        ) : (
                            <ServerInputField
                                label={category.placeholder2}
                                value={serverId}
                                onChange={handleServerIdChange}
                                placeholder={category.placeholder2}
                                showTooltip={category.placeholder2 === "Server"}
                            />
                        )}
                    </>
                )}
            </div>

            {category.isCheckNickname && (isLoading || nicknameData) && (
                <NicknameDisplay isLoading={isLoading} nicknameData={nicknameData} />
            )}
        </>
    );
}