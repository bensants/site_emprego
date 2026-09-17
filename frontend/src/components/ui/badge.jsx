import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'border border-slate-300 text-slate-700 bg-transparent',
    
    // Status coloridos específicos para contratos e processos:
    proposta: 'bg-amber-100 text-amber-800 border-amber-300', // amarelo
    aceito: 'bg-blue-100 text-blue-800 border-blue-300', // azul
    em_andamento: 'bg-purple-100 text-purple-800 border-purple-300', // roxo
    finalizado: 'bg-emerald-100 text-emerald-800 border-emerald-300', // verde
    cancelado: 'bg-red-100 text-red-800 border-red-300', // vermelho

    // Genéricos
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    purple: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
