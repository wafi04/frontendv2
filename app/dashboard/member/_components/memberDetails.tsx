"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate, FormatPrice } from "@/utils/format"
import type { UserWithSession } from "@/types/auth"
import {
    User,
    Phone,
    Calendar,
    Clock,
    CreditCard,
    Shield,
    Monitor,
    Globe,
    Smartphone,
    Chrome,
    CheckCircle,
    XCircle,
} from "lucide-react"

interface MemberDetailSheetProps {
    member: UserWithSession | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MemberDetailSheet({ member, open, onOpenChange }: MemberDetailSheetProps) {
    if (!member) return null

    const getActiveSessionsCount = (sessions: any[]) => {
        const now = new Date()
        return sessions.filter((session) => new Date(session.expires) > now).length
    }

    const getDeviceIcon = (deviceInfo: string) => {
        const device = deviceInfo.toLowerCase()
        if (device.includes("mobile") || device.includes("android") || device.includes("iphone")) {
            return <Smartphone className="h-4 w-4" />
        }
        if (device.includes("chrome") || device.includes("firefox") || device.includes("safari") || device.includes("Mozilla")) {
            return <Chrome className="h-4 w-4" />
        }
        return <Monitor className="h-4 w-4" />
    }

    const isSessionActive = (expiresAt: string) => {
        return new Date(expiresAt) > new Date()
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full max-w-4xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Member Details
                    </SheetTitle>
                    <SheetDescription>Complete information about {member.name || member.username}</SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-140px)] mt-6 px-4">
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                                        <p className="text-sm">{member.name || "Not provided"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Username</p>
                                        <p className="text-sm font-mono">{member.username}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                                        <Badge
                                            variant={member.role === "admin" ? "default" : "outline"}
                                            className={member.role === "admin" ? "bg-purple-100 text-purple-800 hover:bg-purple-100" : ""}
                                        >
                                            <Shield className="h-3 w-3 mr-1" />
                                            {member.role}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <Badge
                                            variant={member.isOnline ? "default" : "secondary"}
                                            className={member.isOnline ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                                        >
                                            {member.isOnline ? (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <XCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {member.isOnline ? "Online" : "Offline"}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Balance</p>
                                        <p className="text-sm font-semibold flex items-center gap-2">
                                            <CreditCard className="h-3 w-3" />
                                            {FormatPrice(member.balance ?? 0)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(member.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {member.whatsapp && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                                        <p className="text-sm flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            {member.whatsapp}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                                    <p className="text-sm flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        {member.lastActiveAt ? formatDate(member.lastActiveAt) : "Never"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Session Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Session Information</CardTitle>
                                <CardDescription>
                                    {getActiveSessionsCount(member.session)} active sessions out of {member.session?.length || 0} total
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {member.session && member.session.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {member.session.map((session, index) => (
                                            <div key={session.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getDeviceIcon(session.deviceInfo)}
                                                        <span className="text-sm font-medium">Session {index + 1}</span>
                                                    </div>
                                                    <Badge
                                                        variant={isSessionActive(session.expires) ? "default" : "secondary"}
                                                        className={isSessionActive(session.expires) ? "bg-green-100 text-green-800" : ""}
                                                    >
                                                        {isSessionActive(session.expires) ? "Active" : "Expired"}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" />
                                                        <span>{session.ip}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Expires: {formatDate(session.expires)}</span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="break-all">{session.userAgent}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">No active sessions found</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* API Key Section */}
                        {member.apiKey && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">API Access</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">API Key</p>
                                        <p className="text-xs font-mono bg-muted p-3 rounded border break-all">
                                            {member.apiKey.substring(0, 20)}...
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
