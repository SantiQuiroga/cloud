'use client';

import { Button } from '@/components/atoms/Button';

interface LoadingButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LoadingButton({
  loading = false,
  disabled = false,
  children,
  loadingText = 'Cargando...',
  onClick,
  type = 'button',
  variant = 'default',
  size = 'default',
  className
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={className}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? loadingText : children}
    </Button>
  );
}
