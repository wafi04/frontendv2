import { CategoryData } from "@/types/category";
import { ServerData } from "@/types/checknickname";

export const shouldShowSecondInput = (category: CategoryData): boolean => {
    return !!(
        category.placeholder2 &&
        category.placeholder2 !== "-" &&
        category.placeholder2 !== "_" &&
        category.placeholder2 !== "." &&
        category.placeholder2 !== "2" &&
        category.placeholder2 !== "h"
    );
};

export const shouldUseDropdown = (hasSecondInput: boolean, serverData?: ServerData): boolean => {
    return hasSecondInput && serverData !== undefined && serverData.length > 0;
};