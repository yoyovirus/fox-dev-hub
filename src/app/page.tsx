/*
  Website: FoX Dev Hub - Tools for Developers
  Author: Rahul Khedekar
  Copyright © 2026 FoX Dev Hub. All rights reserved.

  This code is proprietary and may not be copied, modified,
  or distributed without permission.
*/
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
    Box, Typography, Card, CardContent, Chip, useTheme, alpha, IconButton, Collapse
} from "@mui/material";
import {
    ArrowForward as ArrowForwardIcon,
    ChevronLeft as ChevronLeftIcon,
    DataObject as DataObjectIcon,
    ShieldOutlined as ShieldIcon,
    StorageOutlined as StorageIcon,
    SettingsEthernetOutlined as ServerIcon,
    LockOutlined as LockIcon,
    AddRounded as AddIcon,
    AutoAwesomeOutlined as SparklesIcon
} from "@mui/icons-material";

const CATEGORIES = [
    {
        id: "json",
        name: "JSON Tools",
        description: "A suite for formatting, validating, and transforming JSON data.",
        color: "#7C3AED",
        icon: <DataObjectIcon />,
        tools: [
            { id: "fmt", name: "JSON Formatter", description: "Beautify and minify JSON with customizable indentation.", href: "/en/json-tools/json-formatter", emoji: "{ }", color: "#7C3AED", tags: ["Format", "Minify"] },
            { id: "val", name: "JSON Validator", description: "Quickly validate your JSON data to pinpoint syntax errors.", href: "/en/json-tools/json-validator", emoji: "✓", color: "#059669", tags: ["Validate", "Syntax"] },
            { id: "dif", name: "JSON Diff", description: "Compare two JSON objects and highlight their differences.", href: "/en/json-tools/json-diff", emoji: "⇄", color: "#DC2626", tags: ["Compare", "Changes"] },
            { id: "viz", name: "JSON Visualizer", description: "Explore JSON structures in an interactive, collapsible tree view.", href: "/en/json-tools/json-visualizer", emoji: "❖", color: "#0284C7", tags: ["Tree View", "Navigate"] },
            { id: "gen", name: "JSON Type Generator", description: "Automatically generate TypeScript interfaces and Go structs from any JSON structure.", href: "/en/json-tools/json-type-generator", emoji: "TS", color: "#B45309", tags: ["TypeScript", "Types"] },
            { id: "tbl", name: "JSON to Table", description: "Convert JSON arrays into clean, readable tables instantly.", href: "/en/json-tools/json-to-table", emoji: "⊞", color: "#7C3AED", tags: ["Table", "Convert"] },
        ]
    }
];

export default function Home() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const activeCategory = CATEGORIES.find(c => c.id === openCategory);

    // Absolute Geometric Parity Constants
    const TILE_RADIUS = 16;
    const GLOBAL_TILE_HEIGHT = 250; 
    const GLOBAL_TILE_WIDTH = 360; 

    return (
        <Box sx={{ minHeight: "100%", pb: 8 }}>
            <LayoutGroup>
                {/* Hero Section */}
                <Collapse in={!openCategory}>
                    <Box
                        sx={{
                            textAlign: "center",
                            py: { xs: 5, md: 6 },
                            px: 2,
                            mb: 4,
                            position: "relative",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: "100%",
                                maxWidth: 800,
                                height: "100%",
                                background: isDark
                                    ? "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 75%)"
                                    : "radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 75%)",
                                pointerEvents: "none",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                            <Typography
                                variant="h1"
                                component="h1"
                                fontWeight={950}
                                sx={{
                                    letterSpacing: "-0.04em",
                                    fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem" },
                                    lineHeight: 1.05,
                                    background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                    mb: 2
                                }}
                            >
                                FoX Dev Hub
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Box component="img" src="/foxdevhub_logo.png" alt="FoX Dev Hub Mascot" sx={{ width: { xs: 180, sm: 220, md: 280 }, height: "auto", maxWidth: "100%" }} />
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                            <Chip
                                icon={<LockIcon sx={{ fontSize: "1rem !important", color: "inherit !important" }} />}
                                label="100% PRIVATE • CLIENT-SIDE ONLY"
                                size="small"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: "0.75rem",
                                    letterSpacing: "0.05em",
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: "primary.main",
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    height: 32,
                                    px: 1
                                }}
                            />
                        </Box>

                        <Typography
                            variant="h2"
                            component="h1"
                            fontWeight={950}
                            sx={{
                                mb: 2,
                                letterSpacing: "-0.04em",
                                fontSize: "3rem",
                                lineHeight: 1.05,
                                "& span": {
                                    background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                },
                            }}
                        >
                            Tools for Developers.<br />
                            <span>Where Your Data Never Leaves.</span>
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                maxWidth: 800,
                                mx: "auto",
                                lineHeight: 1.8,
                                fontSize: "1.125rem",
                                fontWeight: 500,
                                mb: 5,
                                opacity: 0.9
                            }}
                        >
                            Experience fast, seamless transformations and validations—right in your browser.<br />
                            No uploads, no delays, no compromises.
                        </Typography>

                        {/* Trust Certification row */}
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "center", md: "stretch" }, justifyContent: "center", gap: { xs: 2, md: 5 }, flexWrap: "wrap" }}>
                            {[
                                { icon: <LockIcon fontSize="small" color="primary" />, title: "Zero Data Leakage", label: "Your data never leaves your device" },
                                { icon: <StorageIcon fontSize="small" color="primary" />, title: "Zero Storage", label: "Nothing is saved. Ever." },
                                { icon: <ServerIcon fontSize="small" color="primary" />, title: "Zero Backend", label: "No servers. No API calls. No tracking." },
                                { icon: <ShieldIcon fontSize="small" color="primary" />, title: "Absolute Privacy", label: "Everything runs locally—secure & instant" }
                            ].map((item, idx) => (
                                <Box key={idx} sx={{ textAlign: "center", maxWidth: 250 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, justifyContent: { xs: "center", md: "flex-start" } }}>
                                        {item.icon}
                                        <Typography variant="caption" fontWeight={900} sx={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "text.primary" }}>
                                            {item.title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.3 }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Collapse>

                {/* Content Area */}
                <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2.5, md: 4 }, position: "relative" }}>
                    <AnimatePresence mode="wait">
                        {!openCategory ? (
                            /* Dashboard Grid Layout - Truly Responsive 3rd/2nd Column Wrap */
                            <motion.div
                                key="dashboard-matrix"
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <Box sx={{ 
                                    display: "grid", 
                                    // Use 1fr max to allow slight expansion before wrapping, preventing immediate cropping
                                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${GLOBAL_TILE_WIDTH}px), 1fr))`, 
                                    gap: 3, 
                                    justifyContent: "center"
                                }}>
                                    {CATEGORIES.map((cat) => (
                                        <motion.div 
                                            key={cat.id} 
                                            layoutId={`card-${cat.id}`}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            style={{ 
                                                height: GLOBAL_TILE_HEIGHT, 
                                                display: "flex", 
                                                justifyContent: "center", 
                                                position: "relative", 
                                                zIndex: 1, 
                                                borderRadius: TILE_RADIUS 
                                            }}
                                        >
                                            <Card
                                                onClick={() => setOpenCategory(cat.id)}
                                                sx={{
                                                    height: GLOBAL_TILE_HEIGHT,
                                                    width: "100%",
                                                    maxWidth: GLOBAL_TILE_WIDTH,
                                                    position: "relative",
                                                    cursor: "pointer",
                                                    bgcolor: "background.paper",
                                                    borderRadius: `${TILE_RADIUS}px`,
                                                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`,
                                                    boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 15px rgba(0,0,0,0.05)",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    boxSizing: "border-box", // Explicitly enforce border-box
                                                    transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                                                    "&:hover": {
                                                        transform: "translateY(-6px)",
                                                        boxShadow: `0 20px 40px ${alpha(cat.color, 0.15)}`,
                                                        borderColor: alpha(cat.color, 0.4),
                                                    },
                                                }}
                                            >
                                                <CardContent sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
                                                    <Box sx={{ width: 120, height: 86, mb: 3, borderRadius: 3.5, bgcolor: isDark ? alpha(cat.color, 0.1) : "#F8FAFC", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 0.75, p: 1.25 }}>
                                                        {cat.tools.map((tool) => (
                                                            <motion.div key={tool.id} layoutId={`icon-${cat.id}-${tool.id}`} transition={{ type: "spring", stiffness: 500, damping: 35 }} style={{ backgroundColor: alpha(tool.color, 0.12), borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: tool.color, fontFamily: "'JetBrains Mono', monospace", zIndex: 10 }}>{tool.emoji}</motion.div>
                                                        ))}
                                                    </Box>
                                                    <Typography variant="h6" fontWeight={950} sx={{ mb: 0.5 }}>{cat.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", opacity: 0.6 }}>{cat.tools.length} Tools Available</Typography>
                                                </CardContent>
                                                <Box sx={{ position: "absolute", bottom: 16, right: 16, width: 24, height: 24, borderRadius: "50%", bgcolor: alpha(cat.color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: cat.color }}><ArrowForwardIcon sx={{ fontSize: 14 }} /></Box>
                                            </Card>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        style={{
                                            height: GLOBAL_TILE_HEIGHT,
                                            display: "flex",
                                            justifyContent: "center",
                                            position: "relative",
                                            zIndex: 1,
                                            borderRadius: TILE_RADIUS
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                height: GLOBAL_TILE_HEIGHT,
                                                width: "100%",
                                                maxWidth: GLOBAL_TILE_WIDTH,
                                                position: "relative",
                                                borderRadius: `${TILE_RADIUS}px`,
                                                bgcolor: isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)",
                                                border: `1px dashed ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}`,
                                                transition: "all 0.3s ease",
                                                display: "flex",
                                                flexDirection: "column",
                                                boxSizing: "border-box",
                                                "&:hover": {
                                                    borderColor: theme.palette.primary.main,
                                                    bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.01),
                                                    "& .coming-soon-icon": { transform: "scale(1.1) rotate(15deg)", color: theme.palette.primary.main }
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
                                                <Box sx={{ width: 120, height: 86, mb: 3, borderRadius: 3.5, bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0"}` }}>
                                                    <SparklesIcon className="coming-soon-icon" sx={{ fontSize: 32, color: "text.disabled", opacity: 0.5, transition: "all 0.3s ease" }} />
                                                </Box>
                                                <Typography variant="h6" fontWeight={950} color="text.disabled" sx={{ mb: 0.5 }}>More Tools Coming Soon</Typography>
                                                <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: "uppercase", opacity: 0.6 }}>Development in Progress</Typography>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        ) : (
                            /* Expanded Category View - Robust No-Crop Responsive Grid */
                            <Box key="expanded-box" sx={{ width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
                                <Box 
                                    onClick={() => setOpenCategory(null)}
                                    sx={{ 
                                        position: "fixed", 
                                        inset: 0, 
                                        zIndex: 40,
                                        bgcolor: "transparent",
                                        cursor: "default" 
                                    }} 
                                />

                                <motion.div
                                    layoutId={`card-${activeCategory?.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    style={{
                                        position: "relative", 
                                        width: "fit-content",
                                        maxWidth: "100%",
                                        backgroundColor: theme.palette.background.paper, 
                                        borderRadius: TILE_RADIUS,
                                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9"}`, 
                                        boxShadow: isDark ? "0 30px 60px rgba(0,0,0,0.5)" : "0 30px 60px rgba(0,0,0,0.05)", 
                                        zIndex: 50,
                                        overflow: "hidden" 
                                    }} 
                                >
                                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", mb: 3.5, gap: 2.5, px: 2 }}>
                                            <IconButton onClick={() => setOpenCategory(null)} sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}>
                                                <ChevronLeftIcon />
                                            </IconButton>
                                            <Box>
                                                <Typography variant="h4" fontWeight={950} sx={{ letterSpacing: "-0.015em", color: "text.primary" }}>{activeCategory?.name}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{activeCategory?.description}</Typography>
                                            </Box>
                                        </Box>

                                        {/* ROBUST RESPONSIVE GRID - Eliminates cropping by allowing tracks to expand before wrapping */}
                                        <Box sx={{ 
                                            display: "grid", 
                                            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${GLOBAL_TILE_WIDTH}px), 1fr))`, 
                                            gap: 3,
                                            width: "100%", 
                                            maxWidth: {
                                                xs: "100%",
                                                sm: GLOBAL_TILE_WIDTH * 2 + 24, // 2 items + 1 gap
                                                md: GLOBAL_TILE_WIDTH * 3 + 48  // 3 items + 2 gaps
                                            },
                                            px: { xs: 2, sm: 0 },
                                            justifyContent: "center"
                                        }}>
                                            {activeCategory?.tools.map((tool) => (
                                                <motion.div 
                                                    key={tool.href} 
                                                    style={{ 
                                                        height: GLOBAL_TILE_HEIGHT, 
                                                        display: "flex", 
                                                        justifyContent: "center" 
                                                    }}
                                                >
                                                    <Card 
                                                        component={Link} 
                                                        href={tool.href} 
                                                        sx={{ 
                                                            height: "100%", 
                                                            width: "100%",
                                                            maxWidth: GLOBAL_TILE_WIDTH,
                                                            display: "flex", 
                                                            flexDirection: "column", 
                                                            textDecoration: "none", 
                                                            bgcolor: alpha(tool.color, isDark ? 0.05 : 0.03), 
                                                            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, 
                                                            borderRadius: `${TILE_RADIUS}px`, 
                                                            transition: "all 0.25s ease", 
                                                            cursor: "pointer", 
                                                            boxSizing: "border-box", // Explicitly enforce border-box
                                                            "&:hover": { 
                                                                transform: "translateY(-4px)", 
                                                                boxShadow: `0 12px 30px ${alpha(tool.color, isDark ? 0.25 : 0.08)}`, 
                                                                borderColor: alpha(tool.color, 0.3), 
                                                                bgcolor: alpha(tool.color, isDark ? 0.08 : 0.06) 
                                                            } 
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column", gap: 2, justifyContent: "space-between", boxSizing: "border-box" }}>
                                                            <Box>
                                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                                                    <motion.div layoutId={`icon-${activeCategory.id}-${tool.id}`} transition={{ type: "spring", stiffness: 500, damping: 35 }} className="tool-icon-box" style={{ width: "52px", height: "52px", borderRadius: "12px", backgroundColor: alpha(tool.color, 0.12), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 900, color: tool.color, fontFamily: "'JetBrains Mono', monospace" }}>{tool.emoji}</motion.div>
                                                                    <Typography variant="subtitle1" fontWeight={950}>{tool.name}</Typography>
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>{tool.description}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: "auto" }}>
                                                                {tool.tags.map(tag => (
                                                                    <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: 20, borderColor: alpha(tool.color, 0.2), color: tool.color, fontWeight: 700 }} />
                                                                ))}
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </Box>
                                    </Box>
                                </motion.div>
                            </Box>
                        )}
                    </AnimatePresence>
                </Box>
            </LayoutGroup>
        </Box>
    );
}
