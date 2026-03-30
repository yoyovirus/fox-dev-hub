"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component to catch and display errors gracefully
 * Prevents entire app from crashing when a component fails
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "400px",
                        p: 4,
                        textAlign: "center",
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            maxWidth: 500,
                            border: "1px solid",
                            borderColor: "error.light",
                            bgcolor: "error.background",
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 64,
                                color: "error.main",
                                mb: 2,
                            }}
                        />
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Something went wrong
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {this.state.error?.message || "An unexpected error occurred"}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => window.location.reload()}
                            sx={{ borderRadius: 2 }}
                        >
                            Reload Page
                        </Button>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
