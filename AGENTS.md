<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS.md

**Version 1.0.0**  
Next Events AI Project  
January 2026

> **Note:**  
> This document is for AI agents and LLMs working in this Next.js 16 + TypeScript + Supabase codebase. It contains build commands, code style guidelines, and development patterns to ensure consistency and quality.

---

## Abstract

Comprehensive guide for AI agents working with the Next Events AI project. This Next.js 16 application uses TypeScript, Tailwind CSS, Supabase, and shadcn/ui components. Contains build/lint/test commands, code style guidelines, import patterns, naming conventions, error handling, and architectural patterns specific to this codebase.

---

## Build, Lint, and Test Commands

### Available Scripts
```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking (if added)

# Testing (Not Yet Implemented)
# No testing framework currently configured
# Recommended setup: Jest + React Testing Library
```

### Single Test Execution (Future Setup)
```bash
# When Jest is added:
npm test -- path/to/test.test.ts

# When Playwright is added:
npx playwright test path/to/test.spec.ts
```

---

## Technology Stack

### Core Technologies
- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript 5+ with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **State Management**: Zustand for global state
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## Code Style Guidelines

### Import Patterns
```typescript
// External libraries first
import { createBrowserClient } from "@supabase/ssr";
import { useEffect } from "react";

// Internal imports with @ alias
import { cn } from "@/lib/utils";
import { IUser } from "@/interfaces";
import useUserStore from "@/store/user-store";
```

**Import Order:**
1. External libraries (React, Next.js, third-party)
2. Internal imports with @ alias (lib, hooks, components)
3. Relative imports (./, ../)

### TypeScript Interfaces
```typescript
// Descriptive interface naming with 'I' prefix
export interface IUser {
  id: number;
  user_id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Payload interfaces for API calls
export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}
```

### Component Patterns
```typescript
// Server Components (default)
export default function Component() {
  // Server-side logic
  return <div>Server Component</div>
}

// Client Components (with "use client")
"use client";
export default function ClientComponent() {
  // Client-side logic with hooks
  return <div>Client Component</div>
}
```

### Server Action Patterns
```typescript
"use server";

export const functionName = async (
  payload: InterfaceType
): Promise<{ success: boolean; message: string; data?: unknown }> => {
  try {
    // Implementation
    return { success: true, message: "Success", data };
  } catch (error: unknown) {
    console.error("Error in functionName:", error);
    return { success: false, message: "Error occurred" };
  }
};
```

---

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (`utils.ts`, `auth-guards.ts`)
- **Actions**: kebab-case (`users.ts`, `events.ts`)
- **Interfaces**: PascalCase with 'I' prefix (`IUser.ts`)

### Variables and Functions
- **Variables**: camelCase (`userName`, `isLoading`)
- **Functions**: camelCase (`fetchUserData`, `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRY_COUNT`)
- **Types/Interfaces**: PascalCase with 'I' prefix (`IUser`, `IEventData`)

### React Components
- **Component Names**: PascalCase (`UserProfile`, `EventCard`)
- **Props**: camelCase (`userName`, `onSubmit`)
- **State Variables**: camelCase (`setUser`, `isLoading`)

---

## Error Handling Patterns

### Consistent Error Response Structure
```typescript
try {
  // Operation
  return { success: true, data: result };
} catch (error: unknown) {
  console.error("Operation failed:", error);
  return { 
    success: false, 
    message: "An unexpected error occurred." 
  };
}
```

### Server Actions Error Handling
```typescript
export const createEvent = async (eventData: IEventPayload) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, message: "Event created", data };
  } catch (error) {
    console.error("Failed to create event:", error);
    return { success: false, message: "Failed to create event" };
  }
};
```

---

## Form Patterns

### React Hook Form + Zod Validation
```typescript
const form = useForm<SchemaType>({
  resolver: zod(schema),
  defaultValues: initialValues,
});

// shadcn/ui form components
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## State Management Patterns

### Zustand Store Pattern
```typescript
export interface UserStore {
  user: Partial<IUser> | null;
  setUser: (payload: Partial<IUser> | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (payload) => set({ user: payload }),
}));
```

---

## Authentication Patterns

### Server-side Auth with Supabase
```typescript
const cookieStore = await cookies();
const supabase = createClient(cookieStore);
const { data: { user } } = await supabase.auth.getUser();

// Role-based guards
export async function adminGuard(): Promise<void> {
  await roleGuard({
    allowedRoles: ["admin"],
    redirectPath: "/user/events",
  });
}
```

---

## Styling Conventions

### Tailwind with cn() Utility
```typescript
className={cn(
  "base-classes",
  variant && "variant-classes",
  className
)}
```

### CSS Variables for Theming
```css
--primary: #0e7490;
--background: #fafaf9;
```

---

## Directory Structure

```
next-events-ai/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (login, register, homepage)
│   ├── (private)/         # Protected routes
│   │   ├── user/         # User-facing pages
│   │   └── admin/        # Admin pages
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── layout/           # Layout components
├── actions/              # Server actions
├── lib/                  # Utilities and configurations
│   ├── supabase/        # Supabase client/server setup
│   └── utils.ts         # Utility functions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── interfaces/           # TypeScript interfaces
└── .agent/skills/        # Agent skills (62 skills)
```

---

## Code Quality Standards

### TypeScript Configuration
- **Strict mode**: Enabled
- **Target**: ES2017
- **Module resolution**: Bundler
- **Path aliases**: `@/*` points to root directory

### ESLint Configuration
- Uses Next.js recommended configuration
- TypeScript support enabled
- Core web vitals checking

### Development Guidelines
- **TypeScript strict mode** enabled
- **Consistent error handling** across all functions
- **Descriptive variable and function names**
- **Comprehensive JSDoc comments** in complex functions
- **Server Actions** for all backend logic
- **shadcn/ui components** for UI consistency

---

## Performance Considerations

### Import Optimization
- Avoid barrel file imports from large libraries
- Use direct imports for icons and components
- Implement dynamic imports for heavy components

### Server-Side Optimization
- Use React.cache() for request deduplication
- Implement parallel data fetching
- Minimize serialization at RSC boundaries

### Client-Side Optimization
- Use Zustand for efficient state management
- Implement proper loading states
- Use React.memo for expensive components

---

## Testing Guidelines (Future Implementation)

### Recommended Testing Setup
```bash
# Unit and Integration Testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# E2E Testing
npm install --save-dev playwright
```

### Testing Patterns
- Test server actions separately
- Test React components with React Testing Library
- Test form validation with Zod schemas
- Test authentication flows end-to-end

---

## Common Patterns to Follow

### API Response Structure
```typescript
// Consistent API response format
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

### Database Queries
```typescript
// Use Supabase client with proper error handling
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('field', value);

if (error) throw error;
return data;
```

### Component Props
```typescript
// Use proper TypeScript interfaces for props
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  disabled?: boolean;
  className?: string;
}
```

---

## Security Best Practices

### Server Actions Security
- Always validate input with Zod schemas
- Implement proper authentication checks
- Use role-based access control
- Sanitize user inputs

### Client-Side Security
- Never expose sensitive data in client components
- Use proper environment variable management
- Implement CSRF protection
- Validate data on both client and server

---

## Environment Variables

### Required Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Other (as needed)
NEXT_PUBLIC_APP_URL=your_app_url
```

---

## Development Workflow

### Before Making Changes
1. Run `npm run lint` to check code quality
2. Ensure TypeScript types are correct
3. Test in development environment
4. Follow existing patterns and conventions

### After Making Changes
1. Test all affected functionality
2. Run linting and type checking
3. Ensure responsive design works
4. Test authentication flows if relevant

---

## Notes for AI Agents

1. **Always use TypeScript interfaces** with 'I' prefix
2. **Follow the established error handling pattern** with success/message structure
3. **Use shadcn/ui components** for UI consistency
4. **Implement proper authentication guards** for protected routes
5. **Use Server Actions** for all backend operations
6. **Follow the import order** and naming conventions
7. **Test thoroughly** before considering changes complete
8. **Use the cn() utility** for conditional Tailwind classes
9. **Implement proper loading states** for async operations
10. **Use Zustand** for global state management

This codebase prioritizes type safety, performance, and maintainability. Follow these guidelines to ensure high-quality contributions.