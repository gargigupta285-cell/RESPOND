import { useCallback, useState } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  label?: string;
  helper?: string;
}

export function FileUpload({
  accept = '*',
  maxSize = 10,
  multiple = false,
  onFilesChange,
  label,
  helper,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateAndAddFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      let errorMsg = '';

      fileArray.forEach((file) => {
        if (file.size > maxSize * 1024 * 1024) {
          errorMsg = `File ${file.name} exceeds ${maxSize}MB limit`;
          return;
        }
        validFiles.push(file);
      });

      if (errorMsg) {
        setError(errorMsg);
        return;
      }

      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
      setError('');
    },
    [files, maxSize, multiple, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      validateAndAddFiles(e.dataTransfer.files);
    },
    [validateAndAddFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      validateAndAddFiles(e.target.files);
    },
    [validateAndAddFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    },
    [files, onFilesChange]
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="w-full">
      {label && <label className="block mb-2">{label}</label>}
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-[#1E3A8A] bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${error ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="mb-2">
          <span className="text-[#1E3A8A] hover:underline cursor-pointer">
            Click to upload
          </span>{' '}
          or drag and drop
        </p>
        <p className="text-sm text-gray-500">
          {helper || `Maximum file size: ${maxSize}MB`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
