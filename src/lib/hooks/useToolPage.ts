"use client";

import { useState, useCallback, useEffect } from "react";

interface UseToolPageOptions {
    /** Whether to validate JSON on input changes */
    validateJson?: boolean;
    /** Default filename for downloads */
    defaultFilename?: string;
    /** Default MIME type for downloads */
    downloadType?: string;
}

interface UseToolPageReturn<TInput = string, TOutput = string> {
    /* Input / Output state */
    input: TInput;
    setInput: React.Dispatch<React.SetStateAction<TInput>>;
    output: TOutput;
    setOutput: React.Dispatch<React.SetStateAction<TOutput>>;

    /* Error state */
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;

    /* Snackbar */
    snackbarOpen: boolean;
    snackbarMessage: string;
    showSnackbar: (message: string) => void;
    hideSnackbar: () => void;
    SnackbarProps: { open: boolean; message: string; autoHideDuration: number; onClose: () => void };

    /* Actions */
    handleCopy: (text?: string) => Promise<void>;
    handleDownload: (content?: string, filename?: string) => void;
    handleClear: (extra?: Record<string, any>) => void;
    handleLoadSample: (sample: string, extra?: Record<string, any>) => void;
}

/**
 * Centralized hook for common tool page patterns.
 * Provides input/output state, snackbar, copy, download, clear, and optional JSON validation.
 */
export function useToolPage<TInput = string, TOutput = string>(
    options: UseToolPageOptions = {}
): UseToolPageReturn<TInput, TOutput> {
    const {
        validateJson = false,
        defaultFilename = "output.txt",
        downloadType = "text/plain",
    } = options;

    const [input, setInput] = useState<TInput>("" as unknown as TInput);
    const [output, setOutput] = useState<TOutput>("" as unknown as TOutput);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    /* Optional JSON validation */
    useEffect(() => {
        if (!validateJson) return;
        const text = input as unknown as string;
        if (!text.trim()) {
            setError(null);
            return;
        }
        try {
            JSON.parse(text);
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    }, [input, validateJson]);

    const showSnackbar = useCallback((message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const handleCopy = useCallback(async (text?: string) => {
        const content = text ?? (output as unknown as string) ?? (input as unknown as string);
        if (!content) return;
        try {
            await navigator.clipboard.writeText(content);
            showSnackbar("Copied to clipboard!");
        } catch {
            showSnackbar("Failed to copy.");
        }
    }, [input, output, showSnackbar]);

    const handleDownload = useCallback((content?: string, filename?: string) => {
        const text = content ?? (output as unknown as string) ?? (input as unknown as string);
        if (!text) return;
        try {
            const blob = new Blob([text], { type: downloadType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename ?? defaultFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showSnackbar("File downloaded!");
        } catch {
            showSnackbar("Failed to download.");
        }
    }, [input, output, downloadType, defaultFilename, showSnackbar]);

    const handleClear = useCallback((extra?: Record<string, any>) => {
        setInput("" as unknown as TInput);
        setOutput("" as unknown as TOutput);
        setError(null);
        extra && Object.entries(extra).forEach(([key, valueSetter]) => {
            // Caller passes setter functions as values, e.g. { setIndent: () => setIndent(2) }
            if (typeof valueSetter === "function") valueSetter();
        });
    }, []);

    const handleLoadSample = useCallback((sample: string, extra?: Record<string, any>) => {
        setInput(sample as unknown as TInput);
        setOutput("" as unknown as TOutput);
        setError(null);
        extra && Object.entries(extra).forEach(([key, valueSetter]) => {
            if (typeof valueSetter === "function") valueSetter();
        });
    }, []);

    return {
        input, setInput,
        output, setOutput,
        error, setError,
        snackbarOpen, snackbarMessage,
        showSnackbar, hideSnackbar,
        SnackbarProps: {
            open: snackbarOpen,
            message: snackbarMessage,
            autoHideDuration: 2000,
            onClose: hideSnackbar,
        },
        handleCopy,
        handleDownload,
        handleClear,
        handleLoadSample,
    };
}
