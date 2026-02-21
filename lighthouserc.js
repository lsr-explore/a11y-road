module.exports = {
  ci: {
    collect: {
      // Use the static build output directly (no separate server needed)
      staticDistDir: './build',
      // Audit a representative set of pages
      url: [
        '/index.html',
        '/docs/intro.html',
        '/docs/tutorial-basics/create-a-document.html',
        '/blog.html',
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // Performance: warn at 80, error below 60
        'categories:performance': ['warn', { minScore: 0.8 }],
        // Accessibility: error below 90 (strict for an a11y-focused site)
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Best practices: warn at 90
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        // SEO: warn at 90
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      // Print results to stdout (no external server needed)
      target: 'temporary-public-storage',
    },
  },
};
