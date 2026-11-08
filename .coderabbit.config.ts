import { defineConfig } from "@coderabbitai/config";

export default defineConfig((ctx) => {
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
        enabled: true,
        allow_author_approval: false,
        max_merge_risk: "low",
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
