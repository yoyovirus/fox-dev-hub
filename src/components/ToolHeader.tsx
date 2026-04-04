"use client";

import React, { memo } from "react";
import { Box, Typography, alpha, useTheme, SvgIcon } from "@mui/material";
import { getToolColor } from "@/lib/toolColors";
import { getToolIconPath } from "@/lib/toolIcons";

interface ToolHeaderProps {
  toolName: string;
  toolColor: string;
  description?: string;
}

/**
 * Reusable tool header component with custom icon
 * Memoized to prevent unnecessary re-renders
 */
export const ToolHeader = memo(function ToolHeader({ toolName, toolColor, description }: ToolHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const iconColor = getToolColor(toolName) || toolColor;
  const iconPath = getToolIconPath(toolName);

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: alpha(iconColor, 0.1),
            border: `1px solid ${alpha(iconColor, 0.2)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SvgIcon
            viewBox="0 0 24 24"
            sx={{
              width: 24,
              height: 24,
              flexShrink: 0,
              color: iconColor,
            }}
          >
            <g dangerouslySetInnerHTML={{ __html: iconPath || "" }} />
          </SvgIcon>
        </Box>
        <Typography variant="h5" fontWeight={800}>{toolName}</Typography>
      </Box>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 6.5 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
});
