# Minigame Project Guidelines

## Project Overview
This is a React-based minigame project built with TypeScript, Vite, and TailwindCSS. The project uses modern web development tools and follows best practices for React development. Currently features a Sudoku game with different difficulty levels and includes a dark/light theme toggle.

## Tech Stack
- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Icons**: FontAwesome & Lucide React
- **Routing**: React Router DOM v7
- **Theme Management**: Custom theme provider with system/dark/light modes

## Project Structure
```
minigame/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Radix UI-based components (button, card, accordion, etc.)
│   │   ├── SudokuGrid/      # Sudoku-specific grid component
│   │   │   └── index.tsx
│   │   ├── navigation.tsx   # Main navigation component
│   │   ├── mobile-nav.tsx   # Mobile navigation component
│   │   ├── theme-provider.tsx # Theme management provider
│   │   ├── theme-toggle.tsx # Theme switcher component
│   │   └── footer.tsx       # Footer component
│   ├── pages/               # Page components
│   │   ├── SudokuPage/      # Sudoku game page with full game logic
│   │   │   └── index.tsx
│   │   ├── Home.tsx         # Landing page
│   │   ├── Games.tsx        # Games listing page
│   │   └── About.tsx        # About page
│   ├── data/                # Game data and assets
│   │   ├── sudoku_easy.json    # Easy difficulty puzzles
│   │   ├── sudoku_medium.json  # Medium difficulty puzzles
│   │   ├── sudoku_hard.json    # Hard difficulty puzzles
│   │   └── sudoku-puzzles.ts   # Sudoku puzzle loading utilities
│   ├── assets/              # Static assets and images
│   │   └── images/
│   │       └── sudoku/      # Sudoku-related images
│   │           └── highlight-error.png
│   ├── lib/                 # Utility functions and shared logic
│   │   └── utils.ts         # Utility functions (cn helper, etc.)
│   ├── App.tsx              # Main application component with routing
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles and Tailwind imports
│   └── vite-env.d.ts        # Vite type definitions
├── public/                  # Static assets (currently empty)
├── dist/                    # Build output
├── node_modules/            # Dependencies
├── .git/                    # Git repository
├── package.json             # Project dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.cjs      # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── .eslintrc.cjs            # ESLint configuration
```
- For each game pages, component, data, create new directory

## Current Features
- **Sudoku Game**: Complete implementation with 3 difficulty levels (Easy, Medium, Hard)
- **Theme Support**: Dark/light/system theme switching
- **Responsive Design**: Mobile-first approach with dedicated mobile navigation
- **Game Data**: 20,000+ Sudoku puzzles per difficulty level
- **Navigation**: React Router-based routing with conditional navigation display
- **UI Components**: Consistent design system using Radix UI components

## Development Setup

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Follow React best practices and hooks guidelines
- Use functional components with TypeScript

### Component Structure
- Place reusable components in `src/components`. Each major component should reside in its own directory with an `index.tsx` file (e.g., `src/components/SudokuGrid/index.tsx`).
- Page components should be in `src/pages`. Each page component should reside in its own directory with an `index.tsx` file for complex pages, or as direct `.tsx` files for simpler pages.
- Shared utilities and hooks in `src/lib`
- Game data and assets in `src/data`

### Styling
- Use TailwindCSS for styling
- Follow mobile-first responsive design
- Use the provided design system components from Radix UI
- Utilize the theme provider for consistent theming across components

### State Management
- Use React hooks for local state
- Use context for global state (theme management is already implemented)
- Consider React.memo for performance optimization

### Routing
- Use React Router DOM v7 for navigation
- Routes are defined in `App.tsx`
- Conditional navigation display (hidden on game pages)

### Game Development
- Store game data in `src/data` directory
- Use JSON files for large datasets (like Sudoku puzzles)
- Create dedicated page components for each game in `src/pages`
- Create reusable game components in `src/components`

### Performance
- Implement code splitting for game pages
- Optimize images and assets
- Use React.memo when necessary
- Implement proper loading states for games

### Testing
- Write unit tests for components
- Test user interactions and game logic
- Ensure accessibility compliance

## Current Dependencies
Key dependencies and their purposes:
- `@radix-ui/react-*` - Accessible UI components (accordion, alert-dialog, hover-card, slot, switch)
- `tailwindcss` - Utility-first CSS framework with animations
- `react-router-dom` - Client-side routing (v7)
- `@fortawesome/*` - Comprehensive icon library
- `lucide-react` - Additional modern icon set
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Conditional styling utilities

## Deployment
1. Build the project:
```bash
npm run build
```
2. The production-ready files will be in the `dist` directory
3. Deploy the contents of the `dist` directory to your hosting service

## Contributing
1. Create a new branch for your feature
2. Follow the code style guidelines
3. Write meaningful commit messages
4. Ensure your changes don't break existing functionality
5. Test thoroughly before submitting a pull request

## Support
For any issues or questions, please create an issue in the repository. 