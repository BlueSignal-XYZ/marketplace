# Contributing to BlueSignal Marketplace

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.

## Getting Started

### Prerequisites

- Node.js v20+
- npm
- Git

### Setup

```bash
git clone https://github.com/bluesignal-xyz/marketplace.git
cd marketplace
npm ci --force
cp .env.example .env
npm run dev
```

See the [README](README.md) for full setup details including environment variables.

## How to Contribute

### Reporting Bugs

Use the [Bug Report](https://github.com/bluesignal-xyz/marketplace/issues/new?template=bug_report.yml) issue template. Include steps to reproduce, expected behavior, and which application mode is affected (Marketplace, Cloud, or Landing).

### Suggesting Features

Use the [Feature Request](https://github.com/bluesignal-xyz/marketplace/issues/new?template=feature_request.yml) issue template.

### Submitting Code

1. **Fork** the repository
2. **Branch** from `master` (`git checkout -b feat/your-feature`)
3. **Code** your changes
4. **Test** — ensure `npm run test:ci` passes
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `chore:` for maintenance
   - `docs:` for documentation
6. **Push** and open a Pull Request against `master`

### Pull Request Guidelines

- Fill out the PR template completely
- Link related issues with `Closes #123`
- Keep PRs focused — one feature or fix per PR
- Ensure CI checks pass before requesting review

## Code Style

- **Linting**: ESLint is configured — run `npx eslint .` before submitting
- **Components**: Use Styled Components for styling
- **State**: Use `useAppContext()` for global state (Cloud/Marketplace modes)
- **Imports**: Prefer absolute paths from `src/`

## License

By contributing, you agree that your contributions will be licensed under the same [BSL 1.1](LICENSE) that covers this project.
