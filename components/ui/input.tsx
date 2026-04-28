import * as React from 'react';
import { cn } from '@/lib/cn';

// Minimal shadcn-style Input. Tailwind v4 + radix token classes.
// Full shadcn input birebir kopya (https://ui.shadcn.com/docs/components/input).

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-slate-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-rose-500 aria-invalid:focus-visible:ring-rose-500',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
