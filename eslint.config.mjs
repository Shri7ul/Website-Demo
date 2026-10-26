import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * Flat config for ESLint 9.
 *
 * `next lint` is deprecated in Next 15 and prompts interactively on a fresh
 * clone, which blocks CI. This config lets `eslint .` run non-interactively.
 *
 * The QA harness and build scripts are plain Node ESM, not app code, so they
 * are linted separately from the Next ruleset.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
      "qa/**",
      "docs/**",
      "public/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // The audit intentionally keeps unused-looking catch bindings and
      // explicit `any` out of the app; keep these as errors so they stay out.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
