"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";

interface ThemeContextType {
    mode: "light" | "dark";
    toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    mode: "light",
    toggleColorMode: () => { },
});

export const useThemeContext = () => useContext(ThemeContext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem("themeMode") as "light" | "dark";
        if (savedMode) {
            setMode(savedMode);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setMode(prefersDark ? "dark" : "light");
        }
        setMounted(true);
    }, []);

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", newMode);
            if (newMode === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return newMode;
        });
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: "#7C3AED",
                        light: "#A78BFA",
                        dark: "#5B21B6",
                        contrastText: "#ffffff",
                    },
                    secondary: {
                        main: "#DB2777",
                        light: "#F472B6",
                        dark: "#9D174D",
                        contrastText: "#ffffff",
                    },
                    ...(mode === "light"
                        ? {
                            background: {
                                default: "#F5F3FF",
                                paper: "#ffffff",
                            },
                            text: {
                                primary: "#1F2937",
                                secondary: "#6B7280",
                            },
                            divider: "#E5E7EB",
                        }
                        : {
                            background: {
                                default: "#0F0A1E",
                                paper: "#1A1033",
                            },
                            text: {
                                primary: "#F9FAFB",
                                secondary: "#9CA3AF",
                            },
                            divider: "#2D2050",
                        }),
                },
                typography: {
                    fontFamily: '"Roboto", sans-serif',
                    fontWeightLight: 300,
                    fontWeightRegular: 400,
                    fontWeightMedium: 500,
                    fontWeightSemiBold: 600,
                    fontWeightBold: 700,
                    fontWeightExtraBold: 800,
                    h1: { fontWeight: 800 },
                    h2: { fontWeight: 800 },
                    h3: { fontWeight: 700 },
                    h4: { fontWeight: 700 },
                    h5: { fontWeight: 600 },
                    h6: { fontWeight: 600 },
                    button: {
                        textTransform: "none",
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                    },
                    caption: {
                        fontWeight: 500,
                    },
                },
                shape: {
                    borderRadius: 12,
                },
                shadows: [
                    "none",
                    "0 2px 8px rgba(0,0,0,0.06)",
                    "0 4px 12px rgba(0,0,0,0.08)",
                    "0 4px 15px rgba(0,0,0,0.1)",
                    "0 4px 20px rgba(0,0,0,0.12)",
                    "0 6px 20px rgba(124, 58, 237, 0.35)",
                    "0 8px 24px rgba(0,0,0,0.12)",
                    "0 8px 32px rgba(0,0,0,0.15)",
                    "0 12px 32px rgba(0,0,0,0.16)",
                    "0 20px 40px rgba(0,0,0,0.2)",
                    ...Array(15).fill("none") as any,
                ],
                components: {
                    MuiButton: {
                        defaultProps: {
                            disableElevation: true,
                        },
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                padding: "8px 20px",
                                fontSize: "0.875rem",
                                transition: "all 0.2s ease",
                            },
                            contained: {
                                "&:hover": {
                                    transform: "translateY(-1px)",
                                    boxShadow: "0 6px 20px rgba(124, 58, 237, 0.35)",
                                },
                            },
                        },
                    },
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                backgroundImage: "none",
                                boxShadow: mode === "dark"
                                    ? "0px 2px 16px rgba(0, 0, 0, 0.4)"
                                    : "0px 2px 12px rgba(0, 0, 0, 0.06)",
                                border: `1px solid ${mode === "dark" ? "#2D2050" : "#EDE9FE"}`,
                                transition: "box-shadow 0.25s ease, transform 0.25s ease",
                            },
                        },
                    },
                    MuiPaper: {
                        styleOverrides: {
                            root: {
                                backgroundImage: "none",
                            },
                        },
                    },
                    MuiDrawer: {
                        styleOverrides: {
                            paper: {
                                backgroundImage: "none",
                                backgroundColor: mode === "dark" ? "#130D2B" : "#FAFAFF",
                                borderRight: `1px solid ${mode === "dark" ? "#2D2050" : "#EDE9FE"}`,
                            },
                        },
                    },
                    MuiAppBar: {
                        styleOverrides: {
                            root: {
                                backgroundImage: "none",
                            },
                        },
                    },
                    MuiListItemButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                                marginBottom: 4,
                                transition: "all 0.2s ease",
                            },
                        },
                    },
                    MuiChip: {
                        styleOverrides: {
                            root: {
                                fontWeight: 600,
                                fontSize: "0.75rem",
                            },
                        },
                    },
                    MuiOutlinedInput: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                            },
                        },
                    },
                    MuiAlert: {
                        styleOverrides: {
                            root: {
                                borderRadius: 10,
                            },
                        },
                    },
                    MuiTooltip: {
                        defaultProps: {
                            arrow: true,
                        },
                        styleOverrides: {
                            tooltip: {
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                            },
                            arrow: {
                                color: '#000000',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    if (!mounted) {
        return <Box sx={{ visibility: "hidden" }}>{children}</Box>;
    }

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
