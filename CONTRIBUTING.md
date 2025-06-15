# Contributing to ApplePaySDK

Thank you for considering contributing to ApplePaySDK! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the existing issues to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

When creating a bug report, please include as much detail as possible:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Any relevant examples or mockups
- An explanation of why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone your fork of the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the required certificates in the `certs` directory
5. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Guidelines

### JavaScript/TypeScript

- Use TypeScript for new files
- Follow the existing code style
- Use ES6+ features where appropriate
- Add JSDoc comments for all functions and classes
- Use meaningful variable and function names

### Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass before submitting a pull request
- Aim for high test coverage

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Project Structure

```
/
├── api/                  # API endpoints
│   ├── kban/             # K/BAN related endpoints
│   ├── pass/             # Pass related endpoints
│   └── ...
├── assets/               # Static assets
│   └── pass/             # Pass template files
├── certs/                # Certificates (not included in repository)
├── docs/                 # Documentation
├── public/               # Public static files
├── utils/                # Utility functions
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies
└── README.md             # Project readme
```

## Adding New Features

When adding new features, please follow these guidelines:

1. **API Endpoints**:
   - Place new endpoints in the appropriate directory under `/api`
   - Follow the existing pattern for request validation, error handling, and response formatting
   - Add proper JSDoc comments

2. **Utility Functions**:
   - Place reusable functions in the `/utils` directory
   - Keep functions small and focused on a single responsibility
   - Add comprehensive tests

3. **Frontend Components**:
   - Follow accessibility best practices
   - Ensure responsive design
   - Add proper error handling

## Documentation

- Update the README.md file with any new features or changes
- Add or update API documentation in the `/docs` directory
- Include examples for new features

## License

By contributing to ApplePaySDK, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

If you have any questions or need help, please open an issue or contact the maintainers directly.

Thank you for contributing to ApplePaySDK!