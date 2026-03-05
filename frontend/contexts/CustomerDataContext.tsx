'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface CustomerDataContextType {
    data: any | null;
    loading: boolean;
    error: Error | null;
}

const CustomerDataContext = createContext<CustomerDataContextType | undefined>(undefined);

export function CustomerDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const res = await api.customerData();
                if (isMounted) {
                    setData(res);
                    setError(null);
                    setLoading(false);
                }
            } catch (e: any) {
                if (isMounted) {
                    setError(e);
                    // setLoading(false); // keep true or handle explicitly if we want fallback
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <CustomerDataContext.Provider value={{ data, loading, error }}>
            {children}
        </CustomerDataContext.Provider>
    );
}

export function useCustomerData() {
    const context = useContext(CustomerDataContext);
    if (context === undefined) {
        throw new Error('useCustomerData must be used within a CustomerDataProvider');
    }
    return context;
}
