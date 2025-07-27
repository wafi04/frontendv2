"use client";
import { useState } from "react";
import { User, Shield, Settings } from "lucide-react";
import { EditProfileContent } from "./editProfile";



export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const menuItems = [
        {
            id: "profile",
            label: "Edit Profile",
            icon: User,
            component: EditProfileContent
        }
    ];

    const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || EditProfileContent;

    return (
        <main className="min-h-screen ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className=" rounded-lg shadow-sm border">
                            <div className="p-4 border-b">
                                <h1 className="text-xl font-bold ">Settings</h1>
                            </div>
                            <nav className="p-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                                                activeTab === item.id
                                                    && "bg-blue-800"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <ActiveComponent />
                    </div>
                </div>
            </div>
        </main>
    );
}