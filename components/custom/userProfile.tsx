import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserProfileProps {
    username: string
    imageUrl?: string
    size?: "sm" | "md" | "lg" | "xl"
    showName?: boolean
    className?: string
}

export function UserProfile({
    username,
    imageUrl,
    size = "md",
    showName = false,
    className
}: UserProfileProps) {
    // Generate initials from username
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // Generate background color based on username
    const getBackgroundColor = (name: string) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-red-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500'
        ]

        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    // Size classes
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
        xl: "h-12 w-12"
    }

    // Text size for initials
    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg"
    }

    // Name text size
    const nameSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg"
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Avatar className={cn(sizeClasses[size])}>
                <AvatarImage src={imageUrl} alt={username} />
                <AvatarFallback
                    className={cn(
                        getBackgroundColor(username),
                        "font-medium",
                        textSizeClasses[size]
                    )}
                >
                    {getInitials(username)}
                </AvatarFallback>
            </Avatar>

            {showName && (
                <span className={cn(
                    "font-medium text-gray-900 truncate",
                    nameSizeClasses[size]
                )}>
                    {username}
                </span>
            )}
        </div>
    )
}