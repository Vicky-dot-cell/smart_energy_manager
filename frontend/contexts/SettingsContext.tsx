'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, type Settings } from '@/lib/api';

interface SettingsContextType {
    settings: Settings | null;
    updateSettings: (newSettings: Settings) => Promise<void>;
    formatCurrency: (value: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        api.settings().then(setSettings).catch(console.error);
    }, []);

    const updateSettings = async (newSettings: Settings) => {
        // In a real app we'd call an API to persist settings here.
        // For this demo we just update local state immediately.
        setSettings(newSettings);
    };

    const formatCurrency = (value: number) => {
        if (!settings) return `$${value}`; // Fallback to dollar if settings not loaded

        const currencyKey = settings.currency;
        if (currencyKey.includes('INR')) return `₹${value}`;
        if (currencyKey.includes('EUR')) return `€${value}`;
        return `$${value}`; // Default USD
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, formatCurrency }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
