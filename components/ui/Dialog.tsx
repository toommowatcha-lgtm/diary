
import React, { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const DialogHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>{children}</div>
);

export const DialogTitle: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
);

export const DialogDescription: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

export const DialogFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>
);
