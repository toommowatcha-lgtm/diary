
import React, { ReactNode } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: ReactNode;
}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props}>
        {children}
    </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => (
    <h3 className={`font-semibold leading-none tracking-tight ${className}`} {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children, ...props }) => (
    <p className={`text-sm text-muted-foreground ${className}`} {...props}>
        {children}
    </p>
);

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
    <div className={`p-6 pt-0 ${className}`} {...props}>
        {children}
    </div>
);
