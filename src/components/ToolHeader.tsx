"use client";

import React from "react";
import { Box, Typography, alpha, useTheme } from "@mui/material";

interface ToolHeaderProps {
  toolName: string;
  toolColor: string;
  description?: string;
}

const iconColors: Record<string, string> = {
  "JSON Formatter": "#7C3AED",
  "JSON Validator": "#059669",
  "JSON Diff": "#3B82F6",
  "JSON Visualizer": "#8B5CF6",
  "JSON Type Generator": "#0EA5E9",
  "JSON to Table": "#EC4899",
  "JSON Path Tester": "#14B8A6",
  "JSON Relationship Visualizer": "#F97316",
  "Base64 Encoder / Decoder": "#6366F1",
  "Image to Base64": "#10B981",
  "Base64 to Image": "#F472B6",
};

const iconContent: Record<string, string> = {
  "JSON Formatter": `<path d="M9 4L5 12L9 20" stroke="${'#7C3AED'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4L19 12L15 20" stroke="${'#7C3AED'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Validator": `<path d="M12 2L6 6V12C6 17.5 9 21 12 21C15 21 18 17.5 18 12V6L12 2Z" stroke="${'#059669'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12L11.5 14.5L15.5 9.5" stroke="${'#059669'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Diff": `<path d="M9 7L13.5 12L9 17" stroke="${'#3B82F6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 7L10.5 12L15 17" stroke="${'#3B82F6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON Visualizer": `<circle cx="12" cy="4" r="2" fill="${'#8B5CF6'}"/><path d="M12 6V11" stroke="${'#8B5CF6'}" stroke-width="2" stroke-linecap="round"/><path d="M7 11H17" stroke="${'#8B5CF6'}" stroke-width="2" stroke-linecap="round"/><path d="M7 11V17" stroke="${'#8B5CF6'}" stroke-width="2" stroke-linecap="round"/><path d="M17 11V17" stroke="${'#8B5CF6'}" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="19" r="2" fill="${'#A78BFA'}"/><circle cx="17" cy="19" r="2" fill="${'#A78BFA'}"/>`,
  "JSON Type Generator": `<path d="M9 4L5 12L9 20" stroke="${'#0EA5E9'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4L19 12L15 20" stroke="${'#0EA5E9'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 15L13 18L15 15" stroke="${'#0EA5E9'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "JSON to Table": `<rect x="5" y="5" width="14" height="14" rx="1.5" stroke="${'#EC4899'}" stroke-width="2"/><path d="M5 10H19" stroke="${'#EC4899'}" stroke-width="2"/><path d="M5 16H19" stroke="${'#EC4899'}" stroke-width="2"/><path d="M12 5V19" stroke="${'#EC4899'}" stroke-width="2"/>`,
  "JSON Path Tester": `<circle cx="10" cy="10" r="5" stroke="${'#14B8A6'}" stroke-width="2"/><path d="M14 14L19 19" stroke="${'#14B8A6'}" stroke-width="2" stroke-linecap="round"/><path d="M7 10H13" stroke="${'#14B8A6'}" stroke-width="2" stroke-linecap="round"/>`,
  "JSON Relationship Visualizer": `<circle cx="12" cy="4" r="2" fill="${'#F97316'}"/><path d="M12 6V11" stroke="${'#F97316'}" stroke-width="2" stroke-linecap="round"/><path d="M7 11H17" stroke="${'#F97316'}" stroke-width="2" stroke-linecap="round"/><path d="M7 11V17" stroke="${'#F97316'}" stroke-width="2" stroke-linecap="round"/><path d="M17 11V17" stroke="${'#F97316'}" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="19" r="2" fill="${'#FB923C'}"/><circle cx="17" cy="19" r="2" fill="${'#FB923C'}"/>`,
  "Base64 Encoder / Decoder": `<path d="M8 8L5 12L8 16" stroke="${'#6366F1'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 8L19 12L16 16" stroke="${'#6366F1'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12H19" stroke="${'#6366F1'}" stroke-width="2" stroke-linecap="round"/>`,
  "Image to Base64": `<rect x="4" y="5" width="11" height="10" rx="1.5" stroke="${'#10B981'}" stroke-width="2"/><path d="M7 11L9 9L11 11L14 8" stroke="${'#10B981'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 10H20" stroke="${'#10B981'}" stroke-width="2" stroke-linecap="round"/><path d="M18 8L20 10L18 12" stroke="${'#10B981'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  "Base64 to Image": `<path d="M4 10H8" stroke="${'#F472B6'}" stroke-width="2" stroke-linecap="round"/><path d="M6 8L8 10L6 12" stroke="${'#F472B6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="5" width="11" height="10" rx="1.5" stroke="${'#F472B6'}" stroke-width="2"/><path d="M13 11L15 9L17 11L20 8" stroke="${'#F472B6'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
};

/**
 * Reusable tool header component with custom icon
 */
export function ToolHeader({ toolName, toolColor, description }: ToolHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const iconColor = iconColors[toolName] || toolColor;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          bgcolor: alpha(iconColor, 0.1),
          border: `1px solid ${alpha(iconColor, 0.2)}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            style={{
              width: 24,
              height: 24,
              flexShrink: 0,
              color: iconColor,
            }}
            dangerouslySetInnerHTML={{
              __html: iconContent[toolName] || ""
            }}
          />
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
}
