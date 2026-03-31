/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Editor } from "@/components/Editor";
import {
    Box, Typography, Button, IconButton, Tooltip, Alert, Snackbar,
    alpha, useTheme, Divider, FormControlLabel, Switch, Stack, Paper
} from "@mui/material";
import {
    ContentCopy, Download as DownloadIcon, DeleteOutline,
    SwapHoriz as SwapHorizIcon, FilePresent, FolderZip
} from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function Base64EncoderDecoderPage() {
    const theme = useTheme();

    const [plainText, setPlainText] = useState<string>("");
    const [base64Text, setBase64Text] = useState<string>("");
    const [isUrlSafe, setIsUrlSafe] = useState<boolean>(false);
    const [mode, setMode] = useState<"auto" | "encode" | "decode">("auto");
    const [detectedType, setDetectedType] = useState<"text" | "base64" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [stats, setStats] = useState<{ plainChars: number; plainBytes: number; base64Chars: number; base64Bytes: number }>({
        plainChars: 0,
        plainBytes: 0,
        base64Chars: 0,
        base64Bytes: 0,
    });
    const [detectedFile, setDetectedFile] = useState<{ type: string; mime: string; extension: string; size: number } | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [downloadBase64, setDownloadBase64] = useState<string>(""); // Store clean Base64 for downloads

    // Track which field currently has focus to determine input direction
    const [inputField, setInputField] = useState<"left" | "right">("left");

    // Debounce refs to avoid freezing on large Base64 strings
    const processPlainTextTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const processBase64TimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (processPlainTextTimeoutRef.current) {
                clearTimeout(processPlainTextTimeoutRef.current);
            }
            if (processBase64TimeoutRef.current) {
                clearTimeout(processBase64TimeoutRef.current);
            }
        };
    }, []);

    // File type detection based on magic bytes
    const detectFileType = useCallback((binaryData: Uint8Array): { type: string; mime: string; extension: string } | null => {
        const bytes = Array.from(binaryData);
        
        // Image formats
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            return { type: "PNG Image", mime: "image/png", extension: "png" };
        }
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            return { type: "JPEG Image", mime: "image/jpeg", extension: "jpg" };
        }
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
            return { type: "GIF Image", mime: "image/gif", extension: "gif" };
        }
        if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && 
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
            return { type: "WebP Image", mime: "image/webp", extension: "webp" };
        }
        if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
            return { type: "BMP Image", mime: "image/bmp", extension: "bmp" };
        }
        if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
            return { type: "ICO Image", mime: "image/x-icon", extension: "ico" };
        }
        if (bytes[0] === 0x89 && bytes[1] === 0x41 && bytes[2] === 0x53 && bytes[3] === 0x43) {
            return { type: "SVGZ (Compressed SVG)", mime: "image/svg+xml", extension: "svgz" };
        }
        
        // Document formats (PDF)
        if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
            return { type: "PDF Document", mime: "application/pdf", extension: "pdf" };
        }
        // Check for %PDF- text signature (alternative check)
        if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2D) {
            return { type: "PDF Document", mime: "application/pdf", extension: "pdf" };
        }

        // Archive formats - ZIP and derivatives (DOCX, XLSX, PPTX are all ZIP-based)
        // PK\x03\x04 is the local file header signature for ZIP
        if (bytes[0] === 0x50 && bytes[1] === 0x4B && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)) {
            return { type: "ZIP Archive", mime: "application/zip", extension: "zip" };
        }
        if (bytes[0] === 0x1F && bytes[1] === 0x8B) {
            return { type: "GZIP Archive", mime: "application/gzip", extension: "gz" };
        }
        if (bytes[0] === 0x52 && bytes[1] === 0x61 && bytes[2] === 0x72 && bytes[3] === 0x21) {
            return { type: "RAR Archive", mime: "application/vnd.rar", extension: "rar" };
        }
        if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) {
            return { type: "ELF Executable", mime: "application/x-executable", extension: "elf" };
        }
        
        return null;
    }, []);

    // Check if decoded data is binary (non-text)
    const isBinaryData = useCallback((data: Uint8Array): boolean => {
        const length = Math.min(data.length, 1024);
        
        for (let i = 0; i < length; i++) {
            const byte = data[i];
            if (byte === 0x00) return true;
            if (byte < 0x08 || (byte > 0x0D && byte < 0x20)) return true;
            if (byte === 0x7F) return true;
        }
        return false;
    }, []);

    // Format file size
    const formatSize = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    // Check if a string looks like valid Base64
    const isValidBase64 = useCallback((str: string): boolean => {
        if (!str || str.trim().length === 0) return false;
        const trimmed = str.trim();
        
        // Allow partial base64 (while typing) - just check character set
        const base64Regex = /^[A-Za-z0-9+/=\-_]+$/;
        if (!base64Regex.test(trimmed)) return false;
        
        // Must be at least 4 characters or have proper structure
        if (trimmed.length < 4) return false;
        
        // Check padding
        const paddingCount = (trimmed.match(/=/g) || []).length;
        if (paddingCount > 2) return false;
        if (paddingCount > 0 && !trimmed.endsWith("=".repeat(paddingCount))) return false;
        
        return true;
    }, []);

    const encode = useCallback((text: string, urlSafe: boolean) => {
        try {
            if (!text) {
                setBase64Text("");
                setStats({ plainChars: 0, plainBytes: 0, base64Chars: 0, base64Bytes: 0 });
                setDetectedFile(null);
                return;
            }
            let encoded = btoa(unescape(encodeURIComponent(text)));
            if (urlSafe) {
                encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
            }
            setBase64Text(encoded);

            const plainBytes = new Blob([text]).size;
            const base64Bytes = new Blob([encoded]).size;
            setStats({
                plainChars: text.length,
                plainBytes,
                base64Chars: encoded.length,
                base64Bytes,
            });
            setError(null);
        } catch (e) {
            setError("Encoding failed: " + (e instanceof Error ? e.message : String(e)));
        }
    }, []);

    const decode = useCallback((base64: string, urlSafe: boolean) => {
        try {
            if (!base64) {
                setPlainText("");
                setStats({ plainChars: 0, plainBytes: 0, base64Chars: 0, base64Bytes: 0 });
                setDetectedFile(null);
                setDetectedType(null);
                setError(null);
                return;
            }

            let toDecode = base64;

            if (urlSafe) {
                toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
            }

            // Add padding if needed
            while (toDecode.length % 4) toDecode += "=";

            const binaryString = atob(toDecode);
            const binaryData = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                binaryData[i] = binaryString.charCodeAt(i);
            }

            const fileType = detectFileType(binaryData);
            let decodedText = "";

            if (fileType || isBinaryData(binaryData)) {
                if (fileType) {
                    setDetectedFile({ ...fileType, size: binaryData.length });
                    decodedText = `[Binary Data Detected: ${fileType.type}]`;
                } else {
                    setDetectedFile({
                        type: "Unknown Binary",
                        mime: "application/octet-stream",
                        extension: "bin",
                        size: binaryData.length,
                    });
                    decodedText = `[Unknown Binary Data - ${binaryData.length} bytes]`;
                }
            } else {
                decodedText = new TextDecoder("utf-8").decode(binaryData);
                setDetectedFile(null);
            }

            setPlainText(decodedText);
            setDetectedType("base64");

            const base64Bytes = new Blob([base64]).size;
            setStats({
                plainChars: decodedText.length,
                plainBytes: new Blob([decodedText]).size,
                base64Chars: base64.length,
                base64Bytes,
            });
            setError(null);
        } catch (e: any) {
            if (e?.name === "InvalidCharacterError") {
                setError("Invalid Base64 string: incorrect padding or corrupted data");
            } else {
                setError("Decoding failed: " + (e?.message || String(e)));
            }
            setPlainText("");
            setDetectedFile(null);
            setDetectedType(null);
            setStats({ plainChars: 0, plainBytes: 0, base64Chars: base64.length, base64Bytes: 0 });
        }
    }, [detectFileType, isBinaryData]);

    // Auto-detect and process input from plain text field
    const processPlainText = useCallback((input: string) => {
        if (!input || input.trim().length === 0) {
            setPlainText("");
            setBase64Text("");
            setStats({ plainChars: 0, plainBytes: 0, base64Chars: 0, base64Bytes: 0 });
            setDetectedFile(null);
            setDetectedType(null);
            setError(null);
            setImagePreview("");
            setImageDimensions(null);
            return;
        }

        // Check if input looks like Base64
        let trimmed = input.trim();
        
        // Remove data URI prefix if present (e.g., data:application/pdf;base64,)
        if (trimmed.startsWith('data:')) {
            const commaIndex = trimmed.indexOf(',');
            if (commaIndex > 0) {
                trimmed = trimmed.substring(commaIndex + 1);
            }
        }
        
        // Remove all whitespace (newlines, spaces) for Base64 validation
        const base64Only = trimmed.replace(/\s+/g, '');
        
        const base64Regex = /^[A-Za-z0-9+/=\-_]+$/;
        const hasPadding = base64Only.includes('=');

        // Detect as Base64 if:
        // 1. Matches Base64 character set
        // 2. Has padding (=) OR is longer than 20 chars (likely Base64)
        const isLongEnough = base64Only.length > 20;

        if (base64Regex.test(base64Only) && (hasPadding || isLongEnough)) {
            // Try to decode as Base64
            let toDecode = base64Only;
            if (isUrlSafe) {
                toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
            }
            while (toDecode.length % 4) toDecode += "=";

            try {
                const binaryString = atob(toDecode);
                const binaryData = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    binaryData[i] = binaryString.charCodeAt(i);
                }

                const fileType = detectFileType(binaryData);

                // Check if it's an image - handle separately with early return
                if (fileType && fileType.type.includes("Image")) {
                    const dataUri = `data:${fileType.mime};base64,${base64Only}`;
                    setImagePreview(dataUri);
                    setImageDimensions(null);
                    
                    const img = new Image();
                    img.onload = () => {
                        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                    };
                    img.src = dataUri;
                    
                    setDetectedFile({ ...fileType, size: binaryData.length });
                    // SWAP: Put Base64 in plainText (left pane), empty in base64Text (right pane shows image)
                    setPlainText(trimmed);
                    setBase64Text("");
                    setDownloadBase64(base64Only); // Store clean Base64 for download
                    setDetectedType("base64");
                    
                    const base64Bytes = new Blob([base64Only]).size;
                    setStats({
                        plainChars: trimmed.length,
                        plainBytes: base64Bytes,
                        base64Chars: 0,
                        base64Bytes: 0,
                    });
                    setError(null);
                    return;
                }
                
                // Handle other Base64 content (non-image files and text)
                let decodedText = "";
                
                // First check if we detected a file type from magic bytes
                if (fileType) {
                    setDetectedFile({ ...fileType, size: binaryData.length });
                    decodedText = `[${fileType.type}]`;
                    setImagePreview("");
                    setDownloadBase64(base64Only); // Store clean Base64 for download
                } 
                // Fallback: Check decoded text for known signatures
                else {
                    try {
                        decodedText = new TextDecoder("utf-8").decode(binaryData);
                        
                        // Check for PDF signature in text
                        if (decodedText.startsWith('%PDF-') || decodedText.includes('%PDF-')) {
                            setDetectedFile({
                                type: "PDF Document",
                                mime: "application/pdf",
                                extension: "pdf",
                                size: binaryData.length,
                            });
                            decodedText = `[PDF Document]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // Check for DOCX signature (contains word/ folder)
                        else if (decodedText.includes('word/') || decodedText.includes('[Content_Types].xml')) {
                            setDetectedFile({
                                type: "Word Document",
                                mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                extension: "docx",
                                size: binaryData.length,
                            });
                            decodedText = `[Word Document]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // Check for XLSX signature (contains xl/ folder)
                        else if (decodedText.includes('xl/') || decodedText.includes('workbook.xml')) {
                            setDetectedFile({
                                type: "Excel Spreadsheet",
                                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                extension: "xlsx",
                                size: binaryData.length,
                            });
                            decodedText = `[Excel Spreadsheet]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // Check for PPTX signature (contains ppt/ folder)
                        else if (decodedText.includes('ppt/')) {
                            setDetectedFile({
                                type: "PowerPoint Presentation",
                                mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                extension: "pptx",
                                size: binaryData.length,
                            });
                            decodedText = `[PowerPoint Presentation]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // Check for ZIP signature (PK)
                        else if (decodedText.startsWith('PK') || binaryData[0] === 0x50 && binaryData[1] === 0x4B) {
                            setDetectedFile({
                                type: "ZIP Archive",
                                mime: "application/zip",
                                extension: "zip",
                                size: binaryData.length,
                            });
                            decodedText = `[ZIP Archive]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // Check if it's binary data
                        else if (isBinaryData(binaryData)) {
                            setDetectedFile({
                                type: "Unknown Binary",
                                mime: "application/octet-stream",
                                extension: "bin",
                                size: binaryData.length,
                            });
                            decodedText = `[Binary Data - ${binaryData.length} bytes]`;
                            setImagePreview("");
                            setDownloadBase64(base64Only); // Store clean Base64 for download
                        }
                        // It's readable text
                        else {
                            setDetectedFile(null);
                            setDownloadBase64(""); // Clear for plain text
                            setImagePreview("");
                        }
                    } catch (e) {
                        // Decoding failed, treat as binary
                        setDetectedFile({
                            type: "Unknown Binary",
                            mime: "application/octet-stream",
                            extension: "bin",
                            size: binaryData.length,
                        });
                        decodedText = `[Binary Data - ${binaryData.length} bytes]`;
                        setDownloadBase64(base64Only); // Store for download
                        setImagePreview("");
                    }
                }

                // SWAP: Put Base64 in plainText (left pane), decoded in base64Text (right pane)
                setPlainText(trimmed);
                setBase64Text(decodedText);
                setDetectedType("base64");
                setError(null);
                return;
            } catch (e) {
                // Not valid Base64, treat as plain text
            }
        }

        // User is typing plain text, so encode it
        setDetectedType("text");
        setDetectedFile(null);
        encode(input, isUrlSafe);
    }, [isUrlSafe, encode, detectFileType, isBinaryData]);

    // Auto-detect and process input from base64 field
    const processBase64 = useCallback((input: string) => {
        if (!input || input.trim().length === 0) {
            setPlainText("");
            setBase64Text("");
            setStats({ plainChars: 0, plainBytes: 0, base64Chars: 0, base64Bytes: 0 });
            setDetectedFile(null);
            setDetectedType(null);
            setError(null);
            setImagePreview("");
            setImageDimensions(null);
            return;
        }

        // Remove all whitespace for processing
        const base64Only = input.trim().replace(/\s+/g, '');
        
        // Always try to decode - add padding if needed
        let toDecode = base64Only;
        if (isUrlSafe) {
            toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
        }
        while (toDecode.length % 4) toDecode += "=";

        try {
            const binaryString = atob(toDecode);
            const binaryData = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                binaryData[i] = binaryString.charCodeAt(i);
            }

            const fileType = detectFileType(binaryData);
            
            // Check if it's an image file type first - handle separately with early return
            if (fileType && fileType.type.includes("Image")) {
                const dataUri = `data:${fileType.mime};base64,${base64Only}`;
                setImagePreview(dataUri);
                setImageDimensions(null);
                
                // Load image to get dimensions
                const img = new Image();
                img.onload = () => {
                    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                };
                img.src = dataUri;
                
                setDetectedFile({ ...fileType, size: binaryData.length });
                setBase64Text(input.trim());
                setPlainText("");
                setDetectedType("base64");
                
                const base64Bytes = new Blob([base64Only]).size;
                setStats({
                    plainChars: 0,
                    plainBytes: 0,
                    base64Chars: input.trim().length,
                    base64Bytes,
                });
                setError(null);
                return; // Exit early for images - don't continue to other checks
            }
            
            // Handle other binary data or text
            let decodedText = "";
            if (fileType) {
                setDetectedFile({ ...fileType, size: binaryData.length });
                decodedText = `[Binary Data Detected: ${fileType.type}]`;
                setImagePreview("");
                setImageDimensions(null);
            } else if (isBinaryData(binaryData)) {
                setDetectedFile({
                    type: "Unknown Binary",
                    mime: "application/octet-stream",
                    extension: "bin",
                    size: binaryData.length,
                });
                decodedText = `[Unknown Binary Data - ${binaryData.length} bytes]`;
                setImagePreview("");
                setImageDimensions(null);
            } else {
                // Use modern UTF-8 decoding
                try {
                    decodedText = new TextDecoder("utf-8").decode(binaryData);
                    setDetectedFile(null);
                    setImagePreview("");
                } catch (e) {
                    // Fallback to old method
                    decodedText = decodeURIComponent(escape(binaryString));
                    setDetectedFile(null);
                    setImagePreview("");
                }
            }

            setBase64Text(input);
            setPlainText(decodedText);
            setDetectedType("base64");

            const base64Bytes = new Blob([input]).size;
            setStats({
                plainChars: decodedText.length,
                plainBytes: new Blob([decodedText]).size,
                base64Chars: input.length,
                base64Bytes,
            });
            setError(null);
        } catch (e) {
            // Can't decode yet (user still typing or invalid), just keep in base64 field
            setBase64Text(input);
            setPlainText("");
            setDetectedType(null);
            setDetectedFile(null);
            if (input.length >= 4) {
                setError("Invalid Base64");
            } else {
                setError(null);
            }
        }
    }, [isUrlSafe, detectFileType, isBinaryData]);

    const handlePlainTextChange = (val: string | undefined) => {
        const text = val || "";
        
        // Clear any pending timeout
        if (processPlainTextTimeoutRef.current) {
            clearTimeout(processPlainTextTimeoutRef.current);
        }
        
        if (mode === "auto") {
            // Always update plain text immediately for responsive typing
            setPlainText(text);
            
            // Debounce the heavy processing for large Base64 strings
            // Use shorter delay for small inputs, longer for large ones
            const delay = text.length > 1000 ? 150 : 50;
            processPlainTextTimeoutRef.current = setTimeout(() => {
                processPlainText(text);
            }, delay);
        } else if (mode === "encode") {
            setPlainText(text);
            encode(text, isUrlSafe);
        } else if (mode === "decode") {
            setBase64Text(text);
            decode(text, isUrlSafe);
        }
    };

    const handleBase64Change = (val: string | undefined) => {
        const base64 = val || "";
        
        // Clear any pending timeout
        if (processBase64TimeoutRef.current) {
            clearTimeout(processBase64TimeoutRef.current);
        }
        
        if (mode === "auto") {
            // Always update base64 text immediately for responsive typing
            setBase64Text(base64);
            
            // Debounce the heavy processing for large Base64 strings
            // Use shorter delay for small inputs, longer for large ones
            const delay = base64.length > 1000 ? 150 : 50;
            processBase64TimeoutRef.current = setTimeout(() => {
                processBase64(base64);
            }, delay);
        } else if (mode === "decode") {
            setBase64Text(base64);
            decode(base64, isUrlSafe);
        } else if (mode === "encode") {
            setPlainText(base64);
            encode(base64, isUrlSafe);
        }
    };

    const handleModeChange = (newMode: "auto" | "encode" | "decode") => {
        setMode(newMode);
        if (newMode === "auto") {
            // In auto mode, process based on which field has content
            if (plainText) {
                processPlainText(plainText);
            } else if (base64Text) {
                processBase64(base64Text);
            }
        } else if (newMode === "encode") {
            encode(plainText, isUrlSafe);
        } else if (newMode === "decode") {
            decode(base64Text, isUrlSafe);
        }
    };

    const handleUrlSafeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsUrlSafe(checked);
        if (mode === "auto") {
            if (plainText) {
                processPlainText(plainText);
            } else if (base64Text) {
                processBase64(base64Text);
            }
        } else if (mode === "encode") {
            encode(plainText, checked);
        } else if (mode === "decode") {
            decode(base64Text, checked);
        }
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
    };

    const handleDownload = () => {
        // Use the stored clean Base64 for downloads
        let base64Only = downloadBase64;
        let source = "downloadBase64 state";

        if (!base64Only) {
            base64Only = (base64Text || plainText).replace(/[^A-Za-z0-9+/=_\-]/g, '');
            source = "extracted from text fields";
        }

        if (!base64Only || base64Only.length < 4) {
            setError("Download failed: Invalid Base64 data");
            return;
        }

        try {
            let toDecode = base64Only;
            if (isUrlSafe) {
                toDecode = toDecode.replace(/-/g, "+").replace(/_/g, "/");
            }
            while (toDecode.length % 4) toDecode += "=";

            const binaryString = atob(toDecode);
            const binaryData = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                binaryData[i] = binaryString.charCodeAt(i);
            }

            // Use detected file info if available, otherwise use generic
            const mime = detectedFile?.mime || "application/octet-stream";
            const extension = detectedFile?.extension || "bin";

            const blob = new Blob([binaryData], { type: mime });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `downloaded-file.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSnackbarMessage(`Downloaded ${detectedFile?.type || "file"}!`);
            setSnackbarOpen(true);
        } catch (e: any) {
            setError("Download failed: " + (e?.message || String(e)));
        }
    };

    const handleClear = () => {
        setPlainText("");
        setBase64Text("");
        setError(null);
        setDetectedFile(null);
        setDetectedType(null);
        setImagePreview("");
        setImageDimensions(null);
        setDownloadBase64("");
    };

    const loadSample = () => {
        const sample = "Hello FoX Dev Hub! 🦊\nBase64 is awesome.";
        // Clear any existing image preview and file detection
        setImagePreview("");
        setImageDimensions(null);
        setDownloadBase64("");
        setDetectedFile(null);

        if (mode === "decode") {
            // In decode mode, load sample as base64
            const sampleBase64 = btoa(unescape(encodeURIComponent(sample)));
            setBase64Text(sampleBase64);
            setPlainText("");
            decode(sampleBase64, isUrlSafe);
        } else {
            // In auto or encode mode, load sample as plain text
            setPlainText(sample);
            encode(sample, isUrlSafe);
        }
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <ToolHeader
                toolName="Base64 Encoder / Decoder"
                toolColor={getToolColor("Base64 Encoder / Decoder")}
                description="Encode text to Base64 or decode it back in real-time. Supports binary files, images, PDF, ZIP, and more."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap",
                p: 1.25, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Button
                    variant={mode === "auto" ? "contained" : "outlined"}
                    onClick={() => handleModeChange("auto")}
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none", minWidth: 60 }}
                >
                    Auto
                </Button>
                <Button
                    variant={mode === "encode" ? "contained" : "outlined"}
                    onClick={() => handleModeChange("encode")}
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none", minWidth: 70 }}
                >
                    Encode
                </Button>
                <Button
                    variant={mode === "decode" ? "contained" : "outlined"}
                    onClick={() => handleModeChange("decode")}
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none", minWidth: 70 }}
                >
                    Decode
                </Button>

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />

                <FormControlLabel
                    control={<Switch checked={isUrlSafe} onChange={handleUrlSafeToggle} size="small" />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600 }}>URL Safe</Typography>}
                    sx={{ ml: 0.5 }}
                />

                <Box sx={{ flexGrow: 1 }} />

                {/* Detection Status */}
                {mode === "auto" && detectedType && (plainText || base64Text) && (
                    <Typography variant="caption" fontWeight={700} sx={{
                        px: 1.5, py: 0.5, borderRadius: 2,
                        bgcolor: alpha(detectedType === "base64" ? "#10B981" : "#7C3AED", 0.1),
                        color: detectedType === "base64" ? "#10B981" : "#7C3AED",
                        border: `1px solid ${alpha(detectedType === "base64" ? "#10B981" : "#7C3AED", 0.3)}`,
                    }}>
                        Detected: {detectedType === "base64" ? "Base64" : "Text"} → {detectedFile ? detectedFile.type : detectedType === "base64" ? "Text" : "Base64"}
                    </Typography>
                )}

                <Button variant="outlined" onClick={loadSample} size="small" sx={{ borderRadius: 2, ml: 1 }}>
                    Sample
                </Button>

                {(plainText || base64Text) && (
                    <>
                        <Tooltip title="Clear all">
                            <IconButton onClick={handleClear} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                <DeleteOutline sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            {/* Statistics */}
            {(plainText || base64Text) && (
                <Box sx={{
                    display: "flex", gap: 2, flexWrap: "wrap", mb: 2,
                    p: 1.5,
                    bgcolor: alpha("#7C3AED", 0.04),
                    borderRadius: 2,
                    border: `1px solid ${alpha("#7C3AED", 0.15)}`,
                }}>
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Plain Text:</Typography>
                        <Typography variant="caption" fontWeight={700}>
                            {stats.plainChars} chars
                        </Typography>
                        <Typography variant="caption" color="text.secondary">•</Typography>
                        <Typography variant="caption" fontWeight={700}>
                            {formatSize(stats.plainBytes)}
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ height: 16, alignSelf: "center" }} />
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Base64:</Typography>
                        <Typography variant="caption" fontWeight={700}>
                            {stats.base64Chars} chars
                        </Typography>
                        <Typography variant="caption" color="text.secondary">•</Typography>
                        <Typography variant="caption" fontWeight={700}>
                            {formatSize(stats.base64Bytes)}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Split pane */}
            <Box sx={{
                flexGrow: 1, display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2, minHeight: 0, flex: 1,
            }}>
                {/* Left Pane - Input */}
                <Box sx={{ flex: "1 1 0", minWidth: 280, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, ml: 0.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {mode === "auto" ? "Input" : mode === "encode" ? "Plain Text" : "Base64 String"}
                        </Typography>
                    </Box>
                    <Box sx={{
                        flexGrow: 1, minHeight: 0, borderRadius: 2.5, overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor
                            value={mode === "auto" ? plainText : mode === "decode" ? base64Text : plainText}
                            placeholder={mode === "encode" ? "Type or paste text to encode..." : mode === "decode" ? "Paste Base64 to decode..." : "Type or paste text or Base64..."}
                            onChange={mode === "auto" ? handlePlainTextChange : mode === "decode" ? handleBase64Change : handlePlainTextChange}
                            readOnly={false}
                            language="plaintext"
                        />
                    </Box>
                </Box>

                {/* Right Pane - Output */}
                <Box sx={{ flex: "1 1 0", minWidth: 280, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, ml: 0.5 }}>
                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {mode === "auto" ? "Output" : mode === "encode" ? "Base64 Output" : "Decoded Result"}
                        </Typography>
                    </Box>

                    {imagePreview ? (
                        <>
                            {/* Image Preview */}
                            <Paper variant="outlined" sx={{
                                flexGrow: 1, p: 2, borderRadius: 4, bgcolor: "background.paper",
                                display: "flex", flexDirection: "column", alignItems: "center",
                                justifyContent: "center", minHeight: 0, overflow: "auto", mb: 2,
                                position: "relative"
                            }}>
                                <Box sx={{ 
                                    position: "absolute", 
                                    top: 16, 
                                    right: 16, 
                                    zIndex: 10,
                                    display: "flex",
                                    gap: 1
                                }}>
                                    <Tooltip title="Download Image">
                                        <Button 
                                            variant="contained"
                                            onClick={handleDownload} 
                                            startIcon={<DownloadIcon fontSize="small" />}
                                            sx={{ 
                                                bgcolor: alpha(theme.palette.primary.main, 0.9), 
                                                color: "white",
                                                backdropFilter: "blur(4px)", 
                                                boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
                                                fontWeight: 700,
                                                textTransform: "none",
                                                borderRadius: 2,
                                                px: 2,
                                                "&:hover": {
                                                    bgcolor: theme.palette.primary.main,
                                                    boxShadow: "0 4px 12px rgba(124,58,237,0.6)"
                                                }
                                            }}
                                        >
                                            Download {detectedFile?.extension?.toUpperCase() || "Image"}
                                        </Button>
                                    </Tooltip>
                                </Box>
                                <Box component="img" src={imagePreview} sx={{
                                    maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
                                    borderRadius: 1, bgcolor: alpha(theme.palette.text.primary, 0.02),
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                                }} />
                            </Paper>

                            {/* Metadata Card */}
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}>
                                    Metadata
                                </Typography>
                                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                        <Stack spacing={1.5}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Dimen:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{imageDimensions?.width} × {imageDimensions?.height}px</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Type:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{detectedFile?.mime}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Base64 Size:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{formatSize(base64Text.length)}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Original Size:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{formatSize(detectedFile?.size || 0)}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Box>
                        </>
                    ) : detectedFile && !imagePreview ? (
                        <>
                            {/* File Download Card */}
                            <Paper variant="outlined" sx={{
                                flexGrow: 1, p: 3, borderRadius: 4, bgcolor: "background.paper",
                                display: "flex", flexDirection: "column", alignItems: "center",
                                justifyContent: "center", minHeight: 0, mb: 2
                            }}>
                                <Box sx={{
                                    width: 80, height: 80, borderRadius: 3,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    mb: 2
                                }}>
                                    {detectedFile?.type.includes("Image") ? <FilePresent sx={{ fontSize: 40, color: "primary.main" }} /> : 
                                     detectedFile?.type.includes("ZIP") || detectedFile?.type.includes("Office") ? <FolderZip sx={{ fontSize: 40, color: "primary.main" }} /> :
                                     <FilePresent sx={{ fontSize: 40, color: "primary.main" }} />}
                                </Box>
                                <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                                    {detectedFile.type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {detectedFile.mime} • {formatSize(detectedFile.size)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        px: 3
                                    }}
                                >
                                    Download {detectedFile.extension.toUpperCase()}
                                </Button>
                            </Paper>

                            {/* File Info Card */}
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}>
                                    File Info
                                </Typography>
                                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                        <Stack spacing={1.5}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Type:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{detectedFile.type}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>MIME:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{detectedFile.mime}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Extension:</Typography>
                                                <Typography variant="caption" fontWeight={800}>.{detectedFile.extension}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Size:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{formatSize(detectedFile.size)}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{
                            flexGrow: 1, minHeight: 0, borderRadius: 2.5, overflow: "hidden",
                            border: `1px solid ${theme.palette.divider}`,
                        }}>
                            <Editor
                                key={`output-${base64Text.length}`}
                                value={mode === "auto" ? base64Text : mode === "encode" ? base64Text : plainText}
                                placeholder={mode === "encode" ? "Encoded Base64 will appear here..." : mode === "decode" ? "Decoded text will appear here..." : "Output will appear here..."}
                                onChange={() => {}}
                                readOnly={true}
                                language="plaintext"
                            />
                        </Box>
                    )}
                </Box>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
        </Box>
    );
}

