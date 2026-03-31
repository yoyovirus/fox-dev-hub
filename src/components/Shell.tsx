"use client";

import React, { useState, useEffect } from "react";
import { AppThemeProvider, useThemeContext } from "@/components/AppThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Tooltip,
    Typography,
    alpha,
    Collapse,
    Fade,
    Zoom,
} from "@mui/material";
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Build as BuildIcon,
} from "@mui/icons-material";
import Image from 'next/image';

function LayoutContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { mode, toggleColorMode } = useThemeContext();
    const theme = useTheme();

    // md: 900px, sm: 600px
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // One Tile Mode threshold (~744px based on 2 * 360px + gaps)
    const isOneTileMode = useMediaQuery("(max-width:768px)");

    // Automatically close sidebar if in one-tile mode to maximize content
    useEffect(() => {
        if (isOneTileMode) {
            setSidebarOpen(false);
        } else if (!isMobile) {
            setSidebarOpen(true);
        }
    }, [isOneTileMode, isMobile]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "background.default" }}>
            <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, height: "100%" }}>
                {/* Top AppBar - Collapses in One-Tile Mode */}
                <Collapse in={!isOneTileMode} sx={{ flex: "0 0 auto" }}>
                    <AppBar
                        position="static"
                        color="transparent"
                        elevation={0}
                        sx={{
                            bgcolor: "background.paper",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <Toolbar sx={{ justifyContent: "space-between", minHeight: "56px !important", px: 2, py: 0 }}>
                            {/* Left: toggle sidebar */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Tooltip title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
                                    <IconButton
                                        onClick={toggleSidebar}
                                        size="small"
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            color: "primary.main",
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                            },
                                        }}
                                    >
                                        {sidebarOpen ? <ChevronLeftIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </Tooltip>

                                {isMobile && (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
                                        <Image
                                            src="/foxdevhub_logo.png"
                                            alt="FoX Dev Hub"
                                            width={28}
                                            height={28}
                                            priority
                                            style={{ borderRadius: '6px' }}
                                        />
                                        <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ letterSpacing: "-0.01em" }}>FoX Dev Hub</Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* Right: theme toggle */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
                                    <IconButton
                                        onClick={toggleColorMode}
                                        size="small"
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 2,
                                            color: "text.secondary",
                                            "&:hover": {
                                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                color: "primary.main",
                                            },
                                        }}
                                    >
                                        {mode === "dark"
                                            ? <LightModeIcon sx={{ fontSize: 18 }} />
                                            : <DarkModeIcon sx={{ fontSize: 18 }} />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Toolbar>
                    </AppBar>
                </Collapse>

                {/* Main content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        minHeight: 0,
                        p: { xs: 2, sm: 3 },
                        position: "relative",
                    }}
                >
                    {/* Floating Toggle for Sidebar in navbar-collapsed mode (One-Tile Mode) */}
                    <Collapse in={isOneTileMode}>
                        <Box
                            sx={{
                                position: "fixed",
                                bottom: 24,
                                right: 24,
                                zIndex: 1000,
                                display: "flex",
                                gap: 1.5,
                            }}
                        >
                            <Fade in={isOneTileMode} timeout={300}>
                                <IconButton
                                    onClick={toggleColorMode}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: "background.paper",
                                        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                        color: "text.primary",
                                        "&:hover": { bgcolor: alpha(theme.palette.background.paper, 0.8) }
                                    }}
                                >
                                    {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Fade>
                            <Zoom in={isOneTileMode} timeout={300}>
                                <IconButton
                                    onClick={toggleSidebar}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: "primary.main",
                                        boxShadow: "0 8px 32px rgba(124, 58, 237, 0.35)",
                                        color: "#fff",
                                        "&:hover": { bgcolor: "primary.dark" }
                                    }}
                                >
                                    {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </Zoom>
                        </Box>
                    </Collapse>

                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export function Shell({ children }: { children: React.ReactNode }) {
    return (
        <AppThemeProvider>
            <ErrorBoundary>
                <LayoutContent>{children}</LayoutContent>
            </ErrorBoundary>
        </AppThemeProvider>
    );
}
