"use client";

import { useState, useCallback } from "react";

interface UseSnackbarReturn {
    snackbarOpen: boolean;
    snackbarMessage: string;
    setSnackbarOpen: (open: boolean) => void;
    setSnackbarMessage: (message: string) => void;
    showSnackbar: (message: string) => void;
    hideSnackbar: () => void;
}

/**
 * Custom hook for managing snackbar state
 * @returns Snackbar state and control functions
 */
export function useSnackbar(initialOpen = false): UseSnackbarReturn {
    const [snackbarOpen, setSnackbarOpen] = useState(initialOpen);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showSnackbar = useCallback((message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    }, []);

    const hideSnackbar = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    return {
        snackbarOpen,
        snackbarMessage,
        setSnackbarOpen,
        setSnackbarMessage,
        showSnackbar,
        hideSnackbar,
    };
}
