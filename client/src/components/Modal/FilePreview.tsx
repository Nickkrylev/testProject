import React from "react";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  // Проверяем, является ли файл изображением
  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <div className="flex space-x-2 mt-2">
      {files.map((file, index) => (
        <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-md">
          <button
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
            onClick={() => onRemove(index)}
          >
            ✕
          </button>
          {isImage(file) ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                📄
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilePreview;
