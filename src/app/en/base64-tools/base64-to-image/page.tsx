/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import {
    Box, Typography, Button, IconButton, Tooltip, Alert, Snackbar,
    alpha, useTheme, Divider, Stack
} from "@mui/material";
import {
    ContentCopy, Download as DownloadIcon, DeleteOutline,
    InfoOutlined, WarningAmber
} from "@mui/icons-material";
import { Editor } from "@/components/Editor";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function Base64ToImagePage() {
    const theme = useTheme();

    const [input, setInput] = useState<string>("");
    const [imageSrc, setImageSrc] = useState<string>("");
    const [metadata, setMetadata] = useState<{ width: number; height: number; size: number; mime: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        if (!input.trim()) {
            setImageSrc("");
            setMetadata(null);
            setError(null);
            return;
        }

        let dataUri = input.trim();
        // If it's just raw base64, try to prepend a generic data URI header
        if (!dataUri.startsWith("data:")) {
            dataUri = `data:image/png;base64,${dataUri}`;
        }

        const img = new Image();
        img.onload = () => {
            setImageSrc(dataUri);
            setError(null);
            
            // Calculate approximate size from base64
            const base64Body = dataUri.split(",")[1] || "";
            const size = Math.floor((base64Body.length * 3) / 4);
            const mime = dataUri.split(";")[0].split(":")[1] || "image/unknown";
            
            setMetadata({
                width: img.naturalWidth,
                height: img.naturalHeight,
                size,
                mime
            });
        };
        img.onerror = () => {
            // If the first attempt failed and it didn't have a header, it might not be PNG
            if (!input.trim().startsWith("data:")) {
                setError("Invalid Base64 string or unsupported image format. Please include the Data URI header (e.g., data:image/png;base64,...).");
            } else {
                setError("Could not decode image. Please check if the Base64 string is valid and correctly formatted.");
            }
            setImageSrc("");
            setMetadata(null);
        };
        img.src = dataUri;
    }, [input]);

    const handleDownload = () => {
        if (!imageSrc) return;
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = `decoded-image.${metadata?.mime.split("/")[1] || "png"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
    };

    const loadSample = async () => {
        try {
            const response = await fetch('/foxdevhub_logo.png');
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setInput(base64);
            };
            reader.readAsDataURL(blob);
        } catch (e) {
            setError("Failed to load sample image");
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <ToolHeader
                toolName="Base64 to Image"
                toolColor={getToolColor("Base64 to Image")}
                description="Decode Base64 strings or Data URIs back into images and view their properties."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={loadSample}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {input && (
                    <>
                        <Tooltip title="Copy Base64">
                            <IconButton onClick={() => handleCopy(input)} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopy sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center" }} />
                        <Tooltip title="Clear">
                            <IconButton onClick={() => setInput("")} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                                <DeleteOutline sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>

            {error && (
                <Alert severity="warning" icon={<WarningAmber />} sx={{ mb: 2, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Content Area */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                {/* Input Section */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Base64 / Data URI Input
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor
                            value={input}
                            placeholder="Paste your Base64 string or Data URI here..."
                            onChange={(val) => setInput(val || "")}
                            language="plaintext"
                        />
                    </Box>
                </Box>

                {/* Preview Section */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary"
                        sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Image Preview
                    </Typography>

                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "#FFFFFF",
                    }}>
                        {imageSrc ? (
                            <Box sx={{
                                width: "100%", height: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative"
                            }}>
                                <Box sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    zIndex: 10
                                }}>
                                    <Tooltip title="Download Image">
                                        <Button
                                            variant="contained"
                                            onClick={handleDownload}
                                            startIcon={<DownloadIcon fontSize="small" />}
                                            size="small"
                                            sx={{
                                                bgcolor: alpha(theme.palette.primary.main, 0.9),
                                                color: "white",
                                                backdropFilter: "blur(4px)",
                                                boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
                                                fontWeight: 700,
                                                textTransform: "none",
                                                borderRadius: 2,
                                                px: 1.5,
                                                "&:hover": {
                                                    bgcolor: theme.palette.primary.main,
                                                    boxShadow: "0 4px 12px rgba(124,58,237,0.6)"
                                                }
                                            }}
                                        >
                                            Download {metadata ? metadata.mime.split("/")[1].toUpperCase() : "Image"}
                                        </Button>
                                    </Tooltip>
                                </Box>
                                <Box component="img" src={imageSrc} sx={{
                                    maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
                                    borderRadius: 1, bgcolor: alpha(theme.palette.text.primary, 0.02),
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                                }} />
                            </Box>
                        ) : (
                            <Box sx={{
                                width: "100%", height: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>Decoded image will appear here</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Metadata Card */}
                    {metadata && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" fontWeight={800} color="text.secondary"
                                sx={{ textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}>
                                Metadata
                            </Typography>
                            <Box sx={{ borderRadius: 2.5, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, bgcolor: "background.paper" }}>
                                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Dimen:</Typography>
                                            <Typography variant="caption" fontWeight={800}>{metadata.width} × {metadata.height}px</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Type:</Typography>
                                            <Typography variant="caption" fontWeight={800}>{metadata.mime}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Base64 Size:</Typography>
                                            <Typography variant="caption" fontWeight={800}>{formatSize(input.length)}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>Original Size:</Typography>
                                            <Typography variant="caption" fontWeight={800}>{formatSize(metadata.size)}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={2000} 
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }} 
            />
        </Box>
    );
}
