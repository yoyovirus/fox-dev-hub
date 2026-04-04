"use client";

import React, { memo } from "react";
import { SvgIcon } from "@mui/material";
import { getToolColor } from "@/lib/toolColors";
import { getToolIconPath } from "@/lib/toolIcons";

interface ToolIconSmallProps {
  toolName: string;
  size?: number;
}

/**
 * Small icon component for tool cards on home page
 * Memoized to prevent unnecessary re-renders
 */
export const ToolIconSmall = memo(function ToolIconSmall({ toolName, size = 20 }: ToolIconSmallProps) {
  const iconPath = getToolIconPath(toolName);
  if (!iconPath) {
    return null;
  }

  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        color: getToolColor(toolName),
      }}
    >
      <g dangerouslySetInnerHTML={{ __html: iconPath }} />
    </SvgIcon>
  );
});
