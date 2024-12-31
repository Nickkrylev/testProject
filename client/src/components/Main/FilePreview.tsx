// FilePreview.tsx
import React from "react";
import { FiX } from "react-icons/fi";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  return (
    <div className="mt-4">
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white border rounded-md">
              <span className="truncate">{file.name}</span>
              <FiX
                className="text-red-500 cursor-pointer"
                onClick={() => onRemove(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilePreview;
