/**
 * Central tool color configuration
 * All tool-specific colors should be defined here
 */

export const TOOL_COLORS = {
  // Primary brand colors
  primary: {
    main: "#7C3AED",
    light: "#A78BFA",
    dark: "#5B21B6",
  },
  secondary: {
    main: "#DB2777",
    light: "#F472B6",
    dark: "#9D174D",
  },
  // JSON Tools
  jsonFormatter: "#7C3AED",
  jsonValidator: "#059669",
  jsonDiff: "#3B82F6",
  jsonVisualizer: "#8B5CF6",
  jsonTypeGenerator: "#0EA5E9",
  jsonToTable: "#EC4899",
  jsonPathTester: "#14B8A6",
  jsonRelationshipVisualizer: "#F97316",
  // Base64 Tools
  base64EncoderDecoder: "#6366F1",
  imageToBase64: "#10B981",
  base64ToImage: "#F472B6",
  // Text Tools
  textCompare: "#14B8A6",
  caseConverter: "#F59E0B",
  lineTools: "#8B5CF6",
  textDiff: "#EC4899",
  findReplace: "#06B6D4",
  textStatistics: "#10B981",
  anagram: "#F97316",
  removeDuplicates: "#6366F1",
  loremIpsum: "#84CC16",
  blabber: "#0EA5E9",
  // Status colors
  success: "#059669",
  error: "#DC2626",
  info: "#0EA5E9",
  warning: "#F97316",
} as const;

export type ToolColorKey = keyof typeof TOOL_COLORS;

/**
 * Get color by tool name
 */
export function getToolColor(toolName: string): string {
  const colorMap: Record<string, string> = {
    "JSON Formatter": TOOL_COLORS.jsonFormatter,
    "JSON Validator": TOOL_COLORS.jsonValidator,
    "JSON Diff": TOOL_COLORS.jsonDiff,
    "JSON Visualizer": TOOL_COLORS.jsonVisualizer,
    "JSON Type Generator": TOOL_COLORS.jsonTypeGenerator,
    "JSON to Table": TOOL_COLORS.jsonToTable,
    "JSON Path Tester": TOOL_COLORS.jsonPathTester,
    "JSON Relationship Visualizer": TOOL_COLORS.jsonRelationshipVisualizer,
    "Base64 Encoder / Decoder": TOOL_COLORS.base64EncoderDecoder,
    "Image to Base64": TOOL_COLORS.imageToBase64,
    "Base64 to Image": TOOL_COLORS.base64ToImage,
    "Text Compare": TOOL_COLORS.textCompare,
    "Case Converter": TOOL_COLORS.caseConverter,
    "Line Tools": TOOL_COLORS.lineTools,
    "Text Diff": TOOL_COLORS.textDiff,
    "Find & Replace": TOOL_COLORS.findReplace,
    "Text Statistics": TOOL_COLORS.textStatistics,
    "Anagram": TOOL_COLORS.anagram,
    "Remove Duplicates": TOOL_COLORS.removeDuplicates,
    "Lorem Ipsum": TOOL_COLORS.loremIpsum,
    "Blabber": TOOL_COLORS.blabber,
  };
  return colorMap[toolName] || TOOL_COLORS.primary.main;
}
