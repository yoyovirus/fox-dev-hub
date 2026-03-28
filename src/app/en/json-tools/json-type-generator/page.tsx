/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState, useEffect } from "react";
import { Editor } from "@/components/Editor";
import { Box, Typography, Button, Snackbar, alpha, useTheme, Select, IconButton, Tooltip, Divider, Alert } from "@mui/material";
import { ContentCopy, Code as CodeIcon, DeleteOutline, Download as DownloadIcon } from "@mui/icons-material";
import { ToolHeader } from "@/components/ToolHeader";

function generateTypeScript(jsonStr: string, rootName = "Root"): string {
    try {
        const obj = JSON.parse(jsonStr);
        const interfaces: string[] = [];

        const getType = (val: any, name: string): string => {
            if (val === null) return "any";
            if (Array.isArray(val)) {
                if (val.length === 0) return "any[]";
                return getType(val[0], name + "Item") + "[]";
            }
            if (typeof val === "object") {
                const interfaceName = name.charAt(0).toUpperCase() + name.slice(1);
                const fields = Object.entries(val).map(([k, v]) => {
                    return `  ${k}: ${getType(v, k)};`;
                });
                interfaces.push(`export interface ${interfaceName} {\n${fields.join("\n")}\n}`);
                return interfaceName;
            }
            return typeof val;
        };

        getType(obj, rootName);
        return interfaces.reverse().join("\n\n");
    } catch (e) {
        return "// Invalid JSON input";
    }
}

function generateGoStructs(jsonStr: string, rootName = "Root"): string {
    try {
        const obj = JSON.parse(jsonStr);
        const structs: string[] = [];

        const getType = (val: any, name: string): string => {
            if (val === null) return "any";
            if (Array.isArray(val)) {
                if (val.length === 0) return "[]any";
                return "[]" + getType(val[0], name + "Item");
            }
            if (typeof val === "object") {
                const structName = name.charAt(0).toUpperCase() + name.slice(1);
                const fields = Object.entries(val).map(([k, v]) => {
                    const fieldName = k.charAt(0).toUpperCase() + k.slice(1);
                    return `  ${fieldName} ${getType(v, k)} \`json:"${k}"\``;
                });
                structs.push(`type ${structName} struct {\n${fields.join("\n")}\n}`);
                return structName;
            }
            if (typeof val === "number") return "float64";
            if (typeof val === "boolean") return "bool";
            return "string";
        };

        getType(obj, rootName);
        return structs.reverse().join("\n\n");
    } catch (e) {
        return "// Invalid JSON input";
    }
}

const SAMPLE_JSON = `{
  "id": 1,
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "active": true
  },
  "tags": ["admin", "editor"],
  "score": 9.5
}`;

export default function TypeGeneratorPage() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");
    const [language, setLanguage] = useState<"typescript" | "go">("typescript");
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (!input.trim()) {
            setError(null);
            setOutput("");
            return;
        }
        try {
            JSON.parse(input);
            setError(null);
            if (language === "typescript") {
                setOutput(generateTypeScript(input));
            } else {
                setOutput(generateGoStructs(input));
            }
        } catch (e: any) {
            setError(e.message);
        }
    }, [input, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setSnackbarOpen(true);
        } catch (err) { }
    };

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: language === "typescript" ? "application/typescript" : "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = language === "typescript" ? "types.ts" : "structs.go";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Page Header */}
            <ToolHeader
                toolName="JSON Type Generator"
                toolColor="#B45309"
                description="Automatically generate TypeScript interfaces and Go structs from any JSON structure."
            />

            {/* Toolbar */}
            <Box sx={{
                display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, flexWrap: "wrap",
                p: { xs: 1, sm: 1.25 }, mb: 2,
                bgcolor: "background.paper",
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
            }}>

                <Box sx={{ display: "flex", gap: 1, ml: 0.5 }}>
                    <Tooltip title="TypeScript">
                        <IconButton
                            onClick={() => {
                                if (language !== "typescript") {
                                    setLanguage("typescript");
                                }
                            }}
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: language === "typescript" ? alpha("#3178C6", 0.1) : "transparent",
                                border: `1px solid ${language === "typescript" ? alpha("#3178C6", 0.4) : theme.palette.divider}`,
                                color: language === "typescript" ? "#3178C6" : "text.secondary",
                                "&:hover": {
                                    bgcolor: alpha("#3178C6", 0.15),
                                    borderColor: alpha("#3178C6", 0.4),
                                    color: "#3178C6",
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-mono), monospace" }}>
                                TS
                            </Typography>
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Go Structs">
                        <IconButton
                            onClick={() => {
                                if (language !== "go") {
                                    setLanguage("go");
                                }
                            }}
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: language === "go" ? alpha("#00ADD8", 0.1) : "transparent",
                                border: `1px solid ${language === "go" ? alpha("#00ADD8", 0.4) : theme.palette.divider}`,
                                color: language === "go" ? "#00ADD8" : "text.secondary",
                                "&:hover": {
                                    bgcolor: alpha("#00ADD8", 0.15),
                                    borderColor: alpha("#00ADD8", 0.4),
                                    color: "#00ADD8",
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, fontFamily: "var(--font-mono), monospace" }}>
                                GO
                            </Typography>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="outlined"
                    onClick={() => setInput(SAMPLE_JSON)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Sample
                </Button>
                {output && (
                    <>
                        <Tooltip title="Copy Types">
                            <IconButton onClick={handleCopy} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <ContentCopy sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Types">
                            <IconButton onClick={handleDownload} size="small" sx={{ borderRadius: 1.5, color: "text.secondary" }}>
                                <DownloadIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: "center", ml: 1.5 }} />
                    </>
                )}
                {(input || output) && (
                    <Tooltip title="Clear">
                        <IconButton onClick={() => { setInput(""); setOutput(""); }} size="small" color="error" sx={{ borderRadius: 1.5 }}>
                            <DeleteOutline sx={{ fontSize: 17 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Error Message */}
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError(null)}
                    sx={{ mb: 2, borderRadius: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* Split Pane */}
            <Box sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}>
                {/* Input */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        JSON Input
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
                            placeholder="Paste your JSON here..."
                            onChange={(val) => setInput(val || "")}
                        />
                    </Box>
                </Box>

                {/* Output */}
                <Box sx={{ flex: "1 1 0", minWidth: 300, minHeight: 250, display: "flex", flexDirection: "column" }}>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, textTransform: "uppercase", letterSpacing: "0.1em", ml: 0.5 }}>
                        {language === "typescript" ? "TypeScript" : "Go"} Output
                    </Typography>
                    <Box sx={{
                        flexGrow: 1,
                        minHeight: 0,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: `1px solid ${theme.palette.divider}`,
                    }}>
                        <Editor
                            value={output}
                            language={language}
                            readOnly={true}
                            placeholder="Generated types/structs will appear here..."
                            onChange={() => { }}
                        />
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                message="Types copied to clipboard!"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Box>
    );
}
