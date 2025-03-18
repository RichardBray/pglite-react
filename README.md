# React, Vite, PGLite Example

A modern Todo application built with React, Vite, and PGLite (PostgreSQL for the browser).

## Project Overview

This project demonstrates how to use PostgreSQL in the browser with PGLite, combined with React and Vite for a fast development experience. It features a simple Todo application that persists data in the browser's localStorage using PostgreSQL-compatible syntax and features.

## Setup Instructions

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/RichardBray/pglite-react.git
cd react-vite-pglite-example
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Features

- Create and view Todo items
- Persistent storage using PGLite with localStorage
- Timestamp tracking for Todo creation
- Modern React hooks pattern
- Fast development with Vite

## PostgreSQL Features Available

This project leverages PGLite, which brings PostgreSQL capabilities to the browser. Some of the powerful PostgreSQL features you can use include:

- Full-Text Search
- Array Data Types
- JSON/JSONB Operations
- Window Functions
- Complex Date/Time Operations
- Common Table Expressions (CTEs)

For detailed examples of these PostgreSQL features and how to implement them in your application, please refer to the [notes.md](./notes.md) file.

## Project Structure

```
├── src/
│   ├── main.tsx        # Application entry point with PGLite setup
│   ├── App.tsx         # Main React component with Todo functionality
│   └── ...
├── notes.md            # PostgreSQL feature examples
└── README.md           # Project documentation
```

## License

MIT

## TypeScript Support

This project is built with TypeScript and provides full type safety. Key TypeScript features in this project:

- Strong typing for React components and props
- Type-safe database operations with PGLite
- Interfaces for database models
- Type checking during development and build time

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run typecheck

# Lint the codebase
npm run lint

# Format code with Prettier
npm run format
```

## Contribution Guidelines

Contributions are welcome! Here's how you can contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

Please ensure your code follows the project's style guide and passes all tests before submitting a PR.
