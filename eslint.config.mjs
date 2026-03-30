import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Code quality
      "no-console": "warn",
      "no-unused-vars": "off", // Disabled, using TS version
      "no-var": "error",
      "prefer-const": "warn",
      "no-duplicate-imports": "error",
      
      // TypeScript specific
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React hooks
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      
      // React best practices
      "react/no-unescaped-entities": "off",
      "react/self-closing-comp": "warn",
      "react/jsx-no-useless-fragment": "warn",
      
      // Performance
      "react/no-array-index-key": "warn",
    },
  },
]);

export default eslintConfig;
