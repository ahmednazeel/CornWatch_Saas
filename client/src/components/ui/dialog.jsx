import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onOpenChange(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, onClose }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6 shadow-lg', className)}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('mb-4 flex flex-col gap-1', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}
