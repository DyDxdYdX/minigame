# Minigame Project Guidelines

## Project Overview
This is a React-based minigame project built with TypeScript, Vite, and TailwindCSS. The project uses modern web development tools and follows best practices for React development.

## Tech Stack
- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Icons**: FontAwesome & Lucide React
- **Routing**: React Router DOM v7

## Project Structure
```
minigame/
├── src/
│   ├── components/     # Reusable UI components (each in its own folder, e.g., SudokuGrid/index.tsx)
│   ├── pages/         # Page components (each in its own folder, e.g., SudokuPage/index.tsx)
│   ├── lib/           # Utility functions and shared logic
│   ├── App.tsx        # Main application component
│   ├── main.tsx       # Application entry point
│   └── index.css      # Global styles
├── public/            # Static assets
├── dist/              # Build output
└── node_modules/      # Dependencies
```

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
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Follow React best practices and hooks guidelines
- Use functional components with TypeScript

### Component Structure
- Place reusable components in `src/components`. Each component should reside in its own directory with an `index.tsx` file (e.g., `src/components/MyComponent/index.tsx`).
- Page components should be in `src/pages`. Each page component should reside in its own directory with an `index.tsx` file (e.g., `src/pages/MyPage/index.tsx`).
- Shared utilities and hooks in `src/lib`

### Styling
- Use TailwindCSS for styling
- Follow mobile-first responsive design
- Use the provided design system components from Radix UI

### State Management
- Use React hooks for local state
- Consider context for global state when needed

### Routing
- Use React Router for navigation
- Define routes in a centralized location

### Performance
- Implement code splitting
- Optimize images and assets
- Use React.memo when necessary
- Implement proper loading states

### Testing
- Write unit tests for components
- Test user interactions
- Ensure accessibility compliance

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
4. Submit a pull request

## Dependencies
Key dependencies and their purposes:
- `@radix-ui/react-*` - Accessible UI components
- `tailwindcss` - Utility-first CSS framework
- `react-router-dom` - Client-side routing
- `@fortawesome/*` - Icon library
- `lucide-react` - Additional icon set

## Support
For any issues or questions, please create an issue in the repository. 