"use client"

import { useState } from "react";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  MapPin, 
  Clock, 
  Shield,
  LogOut,
  Loader2
} from "lucide-react";
import { formatDate } from "@/utils/format";

interface SessionData {
    id?: string;
    deviceInfo: string;
    expires: string;
    ip: string;
    userAgent: string;
    isCurrent?: boolean;
    location?: string;
    lastActive?: string;
}

export  function SessionContent() {
    const [terminatingSession, setTerminatingSession] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const {data : sessions, isLoading} = useQuery({
        queryKey: ['sessions'],
        queryFn: async() => {
            const req = await api.get<API_RESPONSE<SessionData[]>>("/auth/all/sessions");
            return req.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    const {mutate, isPending, error} = useMutation({
        mutationFn: async (id: string) => {
            const req = await api.delete(`/auth/session/${id}`);
            return req.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey :['sessions']});
        }
    });

    const terminateSession = (id: string) => {
        setTerminatingSession(id);
        mutate(id, {
            onSettled: () => {
                setTerminatingSession(null);
            }
        });
    };

    const parseUserAgent = (userAgent: string) => {
        const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
        const isTablet = /iPad|Tablet/.test(userAgent);
        
        if (isMobile && !isTablet) return 'mobile';
        if (isTablet) return 'tablet';
        return 'desktop';
    };

    const getDeviceName = (userAgent: string) => {
        if (userAgent.includes('iPhone')) return 'iPhone';
        if (userAgent.includes('iPad')) return 'iPad';
        if (userAgent.includes('Android')) return 'Android Device';
        if (userAgent.includes('Mac')) return 'Mac';
        if (userAgent.includes('Windows')) return 'Windows PC';
        if (userAgent.includes('Linux')) return 'Linux PC';
        return 'Unknown Device';
    };



    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile':
                return <Smartphone className="w-5 h-5" />;
            case 'tablet':
                return <Monitor className="w-5 h-5" />;
            case 'desktop':
                return <Monitor className="w-5 h-5" />;
            default:
                return <Globe className="w-5 h-5" />;
        }
    };

    const transformedSessions = sessions?.data.map((session, index) => ({
        ...session,
        id: session.id || `session-${index}`,
        deviceType: parseUserAgent(session.userAgent),
        deviceName: getDeviceName(session.userAgent),
        location: session.ip,
        lastActive: formatDate(session.expires),
    }));

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Session Management</h2>
                <p className="text-gray-600">Manage your active sessions and devices</p>
            </div>
            
            <div className=" rounded-lg border shadow-sm"> 
                <div className="p-6">
                    {transformedSessions?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No active sessions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transformedSessions?.map((session, index) => (
                                <div key={session.id}>
                                    <div className="flex items-center justify-between p-4 rounded-lg border  transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12  rounded-full flex items-center justify-center border">
                                                {getDeviceIcon(session.deviceType)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{session.deviceName}</span>
                                                    {session.isCurrent && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                            Current Session
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{session.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>Last active: {session.lastActive}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    IP: {session.ip}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Expires: {new Date(session.expires).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {!session.isCurrent && (
                                            <button
                                                onClick={() => terminateSession(session.id)}
                                                disabled={terminatingSession === session.id}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                            >
                                                {terminatingSession === session.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <LogOut className="w-4 h-4" />
                                                )}
                                                {terminatingSession === session.id ? 'Terminating...' : 'Sign Out'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}