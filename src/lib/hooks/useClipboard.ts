"use client";

import { useCallback, useState } from "react";

interface UseClipboardReturn {
    isCopied: boolean;
    copy: (text: string) => Promise<boolean>;
    reset: () => void;
}

/**
 * Custom hook for clipboard operations
 * Provides copy functionality with success state
 * @returns Copy utilities and state
 */
export function useClipboard(): UseClipboardReturn {
    const [isCopied, setIsCopied] = useState(false);

    const copy = useCallback(async (text: string): Promise<boolean> => {
        if (!text) return false;
        
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }, []);

    const reset = useCallback(() => {
        setIsCopied(false);
    }, []);

    return {
        isCopied,
        copy,
        reset,
    };
}
