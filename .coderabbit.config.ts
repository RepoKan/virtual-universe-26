import { defineConfig, type CodeRabbitConfig } from "@coderabbitai/config";

export default defineConfig((ctx): CodeRabbitConfig => {
  const changedFiles = ctx.pr?.changedFiles;

  const docsOnly =
    changedFiles?.status === "resolved" &&
    changedFiles.paths.length > 0 &&
    changedFiles.paths.every((path) =>
      path.startsWith("docs7/")
    );

  return {
    language: "en-US",
    reviews: {
      profile: docsOnly ? "chill" : "assertive",
      poem: false,

      // AI approval never replaces human review, required CI, or owner authorization.
      auto_review: {
        enabled: true,
      },
      auto_approvals: {
        // Fail closed if the complete changed-file inventory is unavailable.
        enabled: changedFiles?.status === "resolved" && changedFiles.paths.length > 0,
        allow_author_approval: false,
        max_merge_risk: "low",
        max_security_risk: "low",
        overrides: [
          {
            enabled: false,
            paths: [
              ".coderabbit.config.ts",
              ".coderabbit.yaml",
              ".coderabbit.yml",
              ".github/**",
              ".github/workflows/**",
              ".github/CODEOWNERS",
              ".devcontainer/**",
              ".vscode/**",
              ".agents/**",
              ".copilot/**",
              "mcp_config.json",
              "AGENTS.md",
              "**/AGENTS.md",
              "CODEOWNERS",
              "docs/CODEOWNERS",
              "**/CODEOWNERS",
              ".gitmodules",
              ".npmrc",
              "**/.npmrc",
              "package.json",
              "**/package.json",
              "package-lock.json",
              "**/package-lock.json",
              "pnpm-lock.yaml",
              "**/pnpm-lock.yaml",
              "yarn.lock",
              "**/yarn.lock",
              "bun.lock",
              "**/bun.lock",
              "bun.lockb",
              "**/bun.lockb",
            ],
          },
        ],
      },

      path_instructions: [
        {
          path: "docs7/**",
          instructions:
            "Verify Docs7 navigation, MDX frontmatter, " +
            "internal links, examples, and documentation accuracy. " +
            "Flag exposed credentials and private project data.",
        },
        {
          path: ".github/**",
          instructions:
            "Review GitHub and Copilot configuration for " +
            "security risks, unintended repository changes, " +
            "unsafe commands, and missing approval gates.",
        },
      ],
    },
  };
});
