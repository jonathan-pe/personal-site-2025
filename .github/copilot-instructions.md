# AI Rules for Web Development

## Common Technology Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn
- **Animations**: Framer Motion
- **Package Manager**: pnpm
- **Icons**: Lucide React

## Common File Structure and Organization

### Directory Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (auto-generated, minimal edits)
│   ├── theme/        # Theme-related components
│   └── [feature]/    # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and shared logic
├── routes/           # TanStack Router route files
├── assets/           # Static assets (images, etc.)
```

### Import Patterns

- Use absolute imports with `@/` alias for all internal imports
- Group imports: external libraries first, then internal imports
- Use named exports for components and utilities
- Import types with `type` keyword when importing types only

### File Naming Conventions

- **Components**: PascalCase (e.g., `NavHeader.tsx`, `ThemeProvider.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useTheme.ts`, `useMobile.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Routes**: kebab-case or camelCase (e.g., `about.tsx`, `web-development.tsx`)
- **Types**: PascalCase with descriptive names

## Component Patterns

### Component Structure

```typescript
// External imports first
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

// Internal imports with @/ alias
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Component definition with TypeScript
interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

export const Component = ({ className, children }: ComponentProps) => {
  return <div className={cn('default-classes', className)}>{children}</div>
}
```

### React Patterns

- Use functional components with TypeScript interfaces for props
- Prefer named exports over default exports for components
- Implement proper prop spreading with `...props`

### Animation Patterns

- Use Framer Motion for animations with semantic animation names
- Implement staggered animations for text/list items using delays
- Use spring animations for natural movement
- Follow the pattern: `initial` → `animate` → `transition`

```typescript
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
>
```

## Styling Guidelines

### Tailwind CSS Patterns

- Implement responsive design with mobile-first approach (`md:`, `lg:` prefixes)
- Use semantic color tokens from the design system (e.g., `bg-background`, `text-foreground`)
- Prefer Tailwind utilities over custom CSS when possible

### Color System

- Use CSS custom properties for theming
- Support both light and dark modes
- Use semantic color names: `primary`, `secondary`, `accent`, `muted`, `destructive`
- Background colors: `background`, `foreground`, `card`, `popover`

## Routing Patterns

### TanStack Router

- Use file-based routing in the `src/routes/` directory
- Export route configuration with `createFileRoute()`
- Component functions should be named descriptively (not just `Component`)
- Use `RouteComponent` for generic route components

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Route content</div>
}
```

### Navigation

- Use TanStack Router's `Link` component for internal navigation
- Use semantic navigation structure with proper accessibility

## State Management

### Theme Management

- Use React Context for global state (theme, sidebar)
- Implement custom hooks for context consumption (e.g., `useTheme`)
- Store theme preference in localStorage with fallback to system preference
- Support system theme change detection

### Local State

- Use `useState` for component-level state
- Use `useEffect` for side effects and lifecycle management
- Prefer controlled components over uncontrolled

## TypeScript Guidelines

### Type Definitions

- Define interfaces for all component props
- Export types when they might be reused
- Use generic types for reusable components

### Strict Configuration

- Enable strict TypeScript compilation
- Use path aliases defined in `tsconfig.json`
- Prefer explicit typing over `any`

## Performance and Best Practices

### Bundle Optimization

- Use dynamic imports for code splitting when appropriate
- Implement proper tree shaking with named exports
- Optimize images and assets

### Accessibility

- Use semantic HTML elements
- Implement proper ARIA attributes where needed
- Ensure keyboard navigation support
- Support screen readers with descriptive text

### Development Experience

- Use ESLint with TypeScript rules
- Implement consistent code formatting
- Use meaningful variable and function names
- Write self-documenting code

## Testing Considerations

- Components should be testable in isolation
- Use proper TypeScript interfaces for mockable dependencies
- Implement proper error boundaries for production resilience

## Code Quality Rules

### General Guidelines

1. **Consistency**: Follow established patterns throughout the codebase
2. **Readability**: Write self-documenting code with clear naming
3. **Maintainability**: Keep components focused and single-purpose
4. **Performance**: Avoid unnecessary re-renders and optimize bundle size
5. **Accessibility**: Ensure all interactive elements are accessible

### Common Patterns to Follow

- Implement proper TypeScript interfaces
- Use semantic HTML and ARIA attributes
- Follow responsive design principles
- Implement proper error handling
- Use meaningful animation delays and transitions

### Anti-Patterns to Avoid

- Avoid inline styles; use Tailwind classes
- Don't use default exports for components
- Avoid deep prop drilling; use context when needed
- Don't ignore TypeScript errors
- Avoid hardcoded values; use design tokens
- Don't skip accessibility considerations

## Asset Management

- Store images in `src/assets/`
- Use proper alt text for images
- Optimize image formats and sizes
- Reference assets with proper paths in Vite

## Package/Library Management

- Always use the most up-to-date packages where possible (prioritize the major frameworks first)

## Code Suggestions

- Always reference the installed version of documentation for any given package/library (fallback to the latest, stable version's documentation)
- Avoid using any deprecated features or APIs

This file should be updated as the project evolves and new patterns emerge.
