"use client";

import { useState, useEffect, useCallback } from "react";

interface UseJsonValidatorReturn {
    error: string | null;
    isValid: boolean;
    setError: (error: string | null) => void;
    validate: (jsonString: string) => boolean;
}

/**
 * Custom hook for JSON validation
 * Automatically validates JSON input and provides error messages
 * @param input - JSON string to validate
 * @returns Validation state and utilities
 */
export function useJsonValidator(input: string): UseJsonValidatorReturn {
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (!input.trim()) {
            setError(null);
            setIsValid(false);
            return;
        }
        try {
            JSON.parse(input);
            setError(null);
            setIsValid(true);
        } catch (e: any) {
            setError(e.message);
            setIsValid(false);
        }
    }, [input]);

    const validate = useCallback((jsonString: string): boolean => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch {
            return false;
        }
    }, []);

    return {
        error,
        isValid,
        setError,
        validate,
    };
}
