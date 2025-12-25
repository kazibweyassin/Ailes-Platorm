"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocumentType = 'transcript' | 'recommendation' | 'essay' | 'cv' | 'other';

interface DocumentUploaderProps {
  onUpload: (file: File, type: DocumentType) => Promise<void>;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  documentType?: DocumentType;
  label?: string;
}

export function DocumentUploader({
  onUpload,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'text/plain': ['.txt'],
    'image/*': ['.jpg', '.jpeg', '.png']
  },
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  documentType = 'other',
  label = "Upload Document"
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile, documentType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [documentType, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled: isUploading
  });

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : file ? (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop the file here'
                : `Drag and drop your ${documentType} file here, or click to select`}
            </p>
            <p className="text-xs text-gray-500">
              {Object.values(accept)
                .flat()
                .join(', ')} (max {maxSize / 1024 / 1024}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {file && !isUploading && (
        <div className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">File uploaded successfully</span>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
