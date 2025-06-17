'use client';

interface MessageDisplayProps {
  message: string;
  type?: 'error' | 'success' | 'info' | 'warning';
  className?: string;
}

export function MessageDisplay({
  message,
  type = 'info',
  className = ''
}: MessageDisplayProps) {
  if (!message) return null;

  const getMessageStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className={`px-4 py-3 rounded border ${getMessageStyles()} ${className}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
