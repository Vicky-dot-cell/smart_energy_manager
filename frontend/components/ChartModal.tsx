'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function ChartModal({ isOpen, onClose, title, children }: ChartModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all">
            <div
                className="absolute inset-0 cursor-pointer"
                onClick={onClose}
                aria-label="Close modal"
            />

            <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden m-4 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-semibold text-gray-100 uppercase tracking-wider">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* 
                    We provide a fixed aspect ratio or fixed height for the expanded chart
                    so that ResponsiveContainer works properly.
                */}
                <div className="p-8 h-[500px] w-full flex items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}
