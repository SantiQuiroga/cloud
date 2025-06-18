'use client';

import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface FileUploadInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  ({
    onChange,
    accept = "image/*",
    multiple = false,
    disabled = false,
    className,
    children,
    ...props
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.files);
    };

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    return (
      <div className="relative">
        <input
          ref={ref || inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleInputChange}
          className="hidden"
          {...props}
        />
        <div
          onClick={handleClick}
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            "hover:bg-gray-50 hover:border-gray-300",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-gray-200",
            className
          )}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {children || (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  Haz clic para seleccionar {multiple ? 'imágenes' : 'una imagen'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  o arrastra y suelta aquí
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

FileUploadInput.displayName = 'FileUploadInput';
