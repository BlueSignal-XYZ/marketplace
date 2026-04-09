// Lighthouse CI configuration for tri-site frontend scanning.
// URLs are passed via --collect.url in the workflow, not hardcoded here.

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        // Skip audits that require network access (sites are served locally)
        skipAudits: ['is-on-https', 'redirects-http', 'uses-http2'],
      },
    },
    assert: {
      // Advisory only — warn level, no errors that would fail the workflow
      assertions: {
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.7 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.7 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
