import React from 'react';
import { cn } from '@/lib/utils';

const COLORS = {
  up: 'bg-success',
  down: 'bg-destructive',
  pending: 'bg-yellow-500',
  unknown: 'bg-muted-foreground/40',
};

export default function StatusDot({ status = 'unknown', className }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', COLORS[status] || COLORS.unknown)} />
      <span className="text-xs capitalize text-muted-foreground">{status}</span>
    </span>
  );
}
