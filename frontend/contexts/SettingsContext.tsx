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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        api.settings().then(setSettings).catch(console.error);
    }, []);

    const updateSettings = async (newSettings: Settings) => {
        try {
            const res = await api.updateSettings(newSettings);
            if (res.success) {
                setSettings(res.settings);
            }
        } catch (e) {
            console.error("Failed to save settings:", e);
            // Fallback to local state if server fails
            setSettings(newSettings);
        }
    };

    const formatCurrency = (value: number) => {
        const safeValue = Number(value) || 0;

        // Return default unformatted string if not mounted to avoid hydration mismatch
        if (!mounted || !settings) return `₹${safeValue.toFixed(2)}`;

        const currencyKey = settings.currency ?? '';
        if (currencyKey.includes('EUR')) return `€${safeValue.toFixed(2)}`;
        if (currencyKey.includes('USD')) return `$${safeValue.toFixed(2)}`;
        return `₹${safeValue.toFixed(2)}`; // Default INR
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
