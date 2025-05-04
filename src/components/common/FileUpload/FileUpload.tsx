import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onChange: (file: File | null) => void;
  value?: File | null;
  error?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize,
  onChange,
  value,
  error,
  disabled = false,
  label = 'Upload File',
  helperText,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(error);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setErrorMessage(undefined);
      return;
    }

    // Validate file size
    if (maxSize && file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024) * 10) / 10;
      const fileSizeMB = Math.round(file.size / (1024 * 1024) * 10) / 10;
      setErrorMessage(`File size exceeds maximum size (${fileSizeMB}MB > ${maxSizeMB}MB)`);
      onChange(null);
      return;
    }

    // Validate file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return `.${fileExtension}` === type;
        }
        if (type.includes('/*')) {
          const baseType = type.split('/')[0];
          return fileType.startsWith(`${baseType}/`);
        }
        return fileType === type;
      });

      if (!isAccepted) {
        setErrorMessage(`File type not accepted. Please upload ${accept}`);
        onChange(null);
        return;
      }
    }

    setErrorMessage(undefined);
    onChange(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = errorMessage || error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-2 flex justify-between">
          <label className="block text-sm font-medium text-neutral-700">{label}</label>
          {helperText && (
            <span className="text-xs text-neutral-500">{helperText}</span>
          )}
        </div>
      )}
      
      <motion.div
        className={`
          relative flex flex-col items-center justify-center p-6 border-2 border-dashed 
          rounded-lg cursor-pointer transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'} 
          ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-75' : 'hover:bg-neutral-50 hover:border-neutral-400'} 
          ${displayError ? 'border-red-500 bg-red-50' : ''}
        `}
        animate={{
          borderColor: displayError ? '#EF4444' : isDragging ? '#3B82F6' : '#D1D5DB'
        }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleInputChange}
          accept={accept}
          disabled={disabled}
        />

        {value ? (
          <div className="flex items-center space-x-3 w-full">
            <DocumentIcon className="w-8 h-8 text-primary-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-neutral-700 truncate">{value.name}</p>
              <p className="text-xs text-neutral-500">
                {(value.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
            {!disabled && (
              <button 
                type="button"
                onClick={handleRemove}
                className="text-neutral-500 hover:text-neutral-700"
                aria-label="Remove file"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <DocumentIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="mt-2">
              <p className="text-sm font-medium text-neutral-700">
                {isDragging ? 'Drop your file here' : 'Drag and drop your file here, or click to browse'}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {accept ? `File types: ${accept}` : 'All file types accepted'}
                {maxSize ? ` • Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB` : ''}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
};

export default FileUpload;