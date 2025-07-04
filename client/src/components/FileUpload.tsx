import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { FileUploadResult } from '@/lib/types';

interface FileUploadProps {
  onFileProcessed: (result: FileUploadResult) => void;
  onError?: (error: string) => void;
}

export default function FileUpload({ onFileProcessed, onError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type and extension
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];

      const allowedExtensions = ['.pdf', '.docx', '.doc'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      // Check both MIME type and file extension for better compatibility
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension);
      
      if (!isValidType) {
        const errorMsg = `Invalid file type. Please upload a PDF or DOCX file. (Detected: ${file.type || 'unknown'}, Extension: ${fileExtension})`;
        toast({
          title: 'Upload Error',
          description: errorMsg,
          variant: 'destructive'
        });
        onError?.(errorMsg);
        return;
      }

      console.log('File validation passed:', {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: fileExtension
      });

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        const errorMsg = 'File size exceeds 10MB limit.';
        toast({
          title: 'Upload Error',
          description: errorMsg,
          variant: 'destructive'
        });
        onError?.(errorMsg);
        return;
      }

      setUploadedFile(file);
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result: FileUploadResult = await response.json();
        
        toast({
          title: 'Upload Successful',
          description: `Successfully extracted content from ${file.name}`,
        });

        onFileProcessed(result);
      } else {
        // Parse error response properly
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, try text
          try {
            errorMessage = await response.text() || errorMessage;
          } catch {
            // Keep default message if both fail
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('File upload error:', error);
      
      let errorMsg = 'Failed to process file';
      
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Handle specific browser security errors
        if (error.message.includes('NSURLErrorDomain') || error.message.includes('Cannot open file')) {
          errorMsg = 'File access error. This might be due to browser security restrictions. Try saving the file to your Downloads folder and uploading from there, or try a different browser.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorMsg = 'Network error during upload. Please check your connection and try again.';
        }
      }
      
      toast({
        title: 'Upload Failed',
        description: errorMsg,
        variant: 'destructive'
      });
      
      onError?.(errorMsg);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onFileProcessed, onError, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    disabled: uploading
  });

  const clearFile = () => {
    setUploadedFile(null);
    setProgress(0);
  };

  // Handle file selection via button
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onDrop(Array.from(files));
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!uploadedFile ? (
          <div className="space-y-4">
            {/* Primary Choose File Button */}
            <div className="text-center">
              <input
                type="file"
                id="file-input"
                accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              <label htmlFor="file-input">
                <Button 
                  variant="default" 
                  size="lg" 
                  disabled={uploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-5 w-5" />
                    Choose Resume File
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                Supports PDF and DOCX files up to 10MB
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-3 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className={`
                file-upload-area cursor-pointer
                ${isDragActive ? 'dragover' : ''}
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              <div className="text-center py-8">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                {isDragActive ? (
                  <p className="text-base font-medium text-primary">Drop your resume here...</p>
                ) : (
                  <div>
                    <p className="text-base font-medium text-foreground mb-1">
                      Drag and drop your resume here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Having trouble? Try saving the file to Downloads first, or use a different browser
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span className="text-sm text-muted-foreground">Processing...</span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing file...</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {progress === 100 && !uploading && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">File processed successfully!</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Supported formats:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>PDF files (.pdf)</li>
                <li>Microsoft Word documents (.docx, .doc)</li>
                <li>Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
