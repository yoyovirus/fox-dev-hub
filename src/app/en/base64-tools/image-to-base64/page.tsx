/*
  Website: FoX Dev Tools - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Tools. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useCallback, useEffect } from "react";
import {
    Box, Typography, Button, IconButton, Tooltip, Alert, Snackbar,
    alpha, useTheme, Divider, Stack, TextField
} from "@mui/material";
import {
    ContentCopy, Download as DownloadIcon, DeleteOutline,
    CloudUpload as UploadIcon, InsertDriveFile as FileIcon
} from "@mui/icons-material";
import { Editor } from "@/components/Editor";
import { ToolHeader } from "@/components/ToolHeader";
import { getToolColor } from "@/lib/toolColors";

export default function ImageToBase64Page() {
    const theme = useTheme();

    const [file, setFile] = useState<File | null>(null);
    const [base64, setBase64] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [filename, setFilename] = useState<string>("");
    const [filesize, setFilesize] = useState<number>(0);
    const [mimeType, setMimeType] = useState<string>("");
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            processFile(selectedFile);
        }
    };

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        setFilename(selectedFile.name);
        setFilesize(selectedFile.size);
        setMimeType(selectedFile.type);

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setBase64(result);
            if (selectedFile.type.startsWith("image/")) {
                setPreviewUrl(result);
                
                // Calculate dimensions
                const img = new Image();
                img.onload = () => {
                    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                };
                img.src = result;
            } else {
                setPreviewUrl("");
                setDimensions(null);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
    };

    const handleClear = () => {
        setFile(null);
        setBase64("");
        setPreviewUrl("");
        setFilename("");
        setFilesize(0);
        setMimeType("");
        setDimensions(null);
    };

    const processSample = async () => {
        try {
            const response = await fetch('/foxdevtools_logo.png');
            const blob = await response.blob();
            const file = new File([blob], 'foxdevtools_logo.png', { type: 'image/png' });

            setFile(file);
            setFilename('foxdevtools_logo.png');
            setFilesize(file.size);
            setMimeType('image/png');
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setBase64(result);
                setPreviewUrl(result);
                
                const img = new Image();
                img.onload = () => {
                    setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
                };
                img.src = result;
            };
            reader.readAsDataURL(file);
        } catch (e) {
            setSnackbarMessage("Failed to load sample image");
            setSnackbarOpen(true);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getRawBase64 = () => {
        const parts = base64.split(",");
        return parts.length > 1 ? parts[1] : "";
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <ToolHeader
                toolName="Image to Base64"
                toolColor={getToolColor("Image to Base64")}
                description="Convert image files into Base64 strings for CSS, HTML, or data transfer."
            />

            {/* Content Area */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                {/* Upload Section */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Image Upload
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box
                            sx={{
                                p: 4,
                                border: `2px dashed ${theme.palette.divider}`,
                                borderRadius: 4,
                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                },
                            }}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <Box
                                component="input"
                                type="file"
                                id="file-input"
                                sx={{ display: "none" }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Box sx={{
                                width: 64, height: 64, borderRadius: "50%",
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "primary.main"
                            }}>
                                <UploadIcon sx={{ fontSize: 32 }} />
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="h6" fontWeight={700}>Click or Drag Image Here</Typography>
                                <Typography variant="body2" color="text.secondary">Supports JPG, PNG, WEBP, GIF (Max 5MB recommended)</Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    processSample();
                                }}
                                sx={{ borderRadius: 2, px: 3 }}
                            >
                                Load Sample Image
                            </Button>
                        </Box>

                        {file && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{
                                    p: 2, borderRadius: 3, bgcolor: "background.paper",
                                    border: `1px solid ${theme.palette.divider}`,
                                    display: "flex", alignItems: "center", gap: 2
                                }}>
                                    <Box sx={{
                                        width: 48, height: 48, borderRadius: 1.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        overflow: "hidden"
                                    }}>
                                    {previewUrl ? (
                                        <Box component="img" src={previewUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <FileIcon sx={{ color: "primary.main" }} />
                                    )}
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={700} noWrap>{filename}</Typography>
                                    <Typography variant="caption" color="text.secondary">{formatSize(filesize)} • {mimeType}</Typography>
                                </Box>
                                <IconButton onClick={handleClear} size="small" color="error">
                                    <DeleteOutline />
                                </IconButton>
                            </Box>

                            {/* Enhanced Metadata */}
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" fontWeight={800} color="text.secondary"
                                    sx={{ textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}>
                                    Metadata
                                </Typography>
                                <Box sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${theme.palette.divider}`, bgcolor: "background.paper" }}>
                                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                                        <Stack spacing={1.5}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Dimen:</Typography>
                                                <Typography variant="caption" fontWeight={800}>
                                                    {dimensions ? `${dimensions.width} × ${dimensions.height}px` : "Calculating..."}
                                                </Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Type:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{mimeType}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Base64 Size:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{formatSize(base64.length)}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="caption" color="text.secondary" fontWeight={700}>Original Size:</Typography>
                                                <Typography variant="caption" fontWeight={800}>{formatSize(filesize)}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Output Section */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        Base64 Output
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: "background.paper",
                    }}>
                        {!base64 ? (
                            <Box sx={{
                                width: "100%", height: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>Upload an image to see the Base64 output</Typography>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
                                {/* Data URI Output */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                            Full Data URI
                                        </Typography>
                                        <Button size="small" startIcon={<ContentCopy sx={{ fontSize: 14 }} />} onClick={() => handleCopy(base64)} sx={{ fontSize: "0.7rem", py: 0.2 }}>
                                            Copy
                                        </Button>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={base64}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2.5,
                                                fontSize: "0.75rem",
                                                bgcolor: alpha(theme.palette.text.primary, 0.02)
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Raw Base64 */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                            Raw Base64 (Body Only)
                                        </Typography>
                                        <Button size="small" startIcon={<ContentCopy sx={{ fontSize: 14 }} />} onClick={() => handleCopy(getRawBase64())} sx={{ fontSize: "0.7rem", py: 0.2 }}>
                                            Copy
                                        </Button>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={getRawBase64()}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2.5,
                                                fontSize: "0.75rem",
                                                bgcolor: alpha(theme.palette.text.primary, 0.02)
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Snippets */}
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em", display: "block", mb: 1 }}>
                                            HTML Snippet
                                        </Typography>
                                        <Box sx={{
                                            p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.text.primary, 0.04),
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: "flex", alignItems: "center", justifyContent: "space-between"
                                        }}>
                                            <Typography sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexGrow: 1 }}>
                                                &lt;img src="{base64.substring(0, 30)}..." /&gt;
                                            </Typography>
                                            <IconButton size="small" onClick={() => handleCopy(`<img src="${base64}" alt="${filename}" />`)}>
                                                <ContentCopy sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight={800} color="text.secondary"
                                            sx={{ textTransform: "uppercase", letterSpacing: "0.1em", display: "block", mb: 1 }}>
                                            CSS Snippet
                                        </Typography>
                                        <Box sx={{
                                            p: 1.5, borderRadius: 2.5, bgcolor: alpha(theme.palette.text.primary, 0.04),
                                            border: `1px solid ${theme.palette.divider}`,
                                            display: "flex", alignItems: "center", justifyContent: "space-between"
                                        }}>
                                            <Typography sx={{ fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexGrow: 1 }}>
                                                background-image: url("{base64.substring(0, 30)}...");
                                            </Typography>
                                            <IconButton size="small" onClick={() => handleCopy(`background-image: url("${base64}");`)}>
                                                <ContentCopy sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
        </Box>
    );
}

