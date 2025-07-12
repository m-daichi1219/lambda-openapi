# Contributing to lambda-openapi

We welcome contributions! This document outlines the process for contributing to this project.

## Development Setup

1. Fork and clone the repository
```bash
git clone https://github.com/yourusername/lambda-openapi.git
cd lambda-openapi
```

2. Install dependencies
```bash
npm install
```

3. Build the project
```bash
npm run build
```

4. Run tests
```bash
npm test
```

## Development Workflow

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

- Write tests for new features
- Ensure all tests pass: `npm test`
- Maintain test coverage above 90%: `npm run test:coverage`

### Building

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run build:watch
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests as needed
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

### Commit Messages

Use conventional commit format:
- `feat: add new decorator`
- `fix: resolve type inference issue`
- `docs: update getting started guide`
- `test: add unit tests for generator`

## Project Structure

```
src/
├── decorators/     # Decorator implementations
├── generator/      # OpenAPI generation logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── cli.ts          # Command line interface

test/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test fixtures

examples/
├── basic/          # Basic usage example
├── advanced/       # Advanced features example
└── cdk/            # CDK integration example
```

## Guidelines

### TypeScript

- Use strict TypeScript settings
- Prefer interfaces over types where appropriate
- Export types that consumers might need
- Use generics for reusable components

### Decorators

- Keep decorator APIs simple and intuitive
- Follow existing patterns
- Provide good TypeScript type support
- Include comprehensive JSDoc comments

### Testing

- Test all public APIs
- Include both positive and negative test cases
- Use descriptive test names
- Mock external dependencies

### Documentation

- Update README.md for significant changes
- Add JSDoc comments for public APIs
- Include examples in documentation
- Keep documentation up to date

## Issues

When reporting issues:

1. Check existing issues first
2. Use issue templates
3. Provide minimal reproduction cases
4. Include environment details

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Look at examples in the repo

Thank you for contributing! 🎉 