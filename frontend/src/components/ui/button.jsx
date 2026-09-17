import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', type = 'button', children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer';

    const variants = {
      default:
        'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md hover:shadow-blue-500/20',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200',
      ghost:
        'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      subtle:
        'bg-blue-50 text-blue-700 hover:bg-blue-100',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 px-3 text-xs rounded-lg',
      lg: 'h-12 px-6 text-base rounded-xl',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
