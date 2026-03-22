"use client";

import { Box, Typography, Button, useTheme, alpha } from "@mui/material";
import Link from "next/link";
import { Home, ArrowLeft } from "@mui/icons-material";

export default function NotFound() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                background: isDark
                    ? "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
            }}
        >
            <Box sx={{ textAlign: "center", maxWidth: 600 }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: "6rem", sm: "8rem", md: "10rem" },
                        fontWeight: 900,
                        lineHeight: 1,
                        background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        mb: 2,
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mb: 2, color: "text.primary" }}
                >
                    Page Not Found
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 4, fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    <br />
                    Let&apos;s get you back on track.
                </Typography>

                <Button
                    component={Link}
                    href="/"
                    variant="contained"
                    startIcon={<Home />}
                    size="large"
                    sx={{
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        bgcolor: "primary.main",
                        "&:hover": {
                            bgcolor: "primary.dark",
                        },
                    }}
                >
                    Go Home
                </Button>
            </Box>
        </Box>
    );
}
