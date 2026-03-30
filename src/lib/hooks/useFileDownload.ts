"use client";

import { useCallback } from "react";

interface DownloadOptions {
    filename: string;
    type?: string;
}

/**
 * Custom hook for file downloads
 * Provides utility to download content as file
 * @returns Download function
 */
export function useFileDownload() {
    const download = useCallback((
        content: string,
        { filename, type = "text/plain" }: DownloadOptions
    ) => {
        if (!content) return;

        try {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        } catch (error) {
            console.error("Download failed:", error);
            return false;
        }
    }, []);

    return { download };
}
