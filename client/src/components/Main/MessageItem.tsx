// src/components/Chat/MessageItem.tsx
import React from "react";
import { FiFile, FiDownload } from "react-icons/fi"; // Добавлена иконка FiDownload для действия скачивания

interface MessageItemProps {
  text: string;
  timestamp: string;
  isOwn: boolean;
  attachments: string[];
  avatarUrl?: string; // Опциональный пропс для динамических аватаров
}

const isImage = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|bmp|svg)$/i.test(url);
};

const getFileName = (url: string): string => {
  try {
    return decodeURIComponent(url.split("/").pop() || "File");
  } catch {
    return "File";
  }
};

// Функция для сокращения названий файлов
const truncateFileName = (name: string, maxLength: number = 20): string => {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength - 3)}...`;
};

// Функция для скачивания файла
const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Не удалось загрузить файл.");
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Ошибка при скачивании файла:", error);
    alert("Не удалось скачать файл.");
  }
};

const MessageItem: React.FC<MessageItemProps> = ({
  text,
  timestamp,
  isOwn,
  attachments,
  avatarUrl,
}) => {
  return (
    <div
      className={`flex items-start ${
        isOwn ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {/* Отображение аватара, если сообщение не от текущего пользователя */}
      {!isOwn && avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
      )}
      {/* Запасной аватар, если avatarUrl не предоставлен */}
      {!isOwn && !avatarUrl && (
        <img
          src="https://via.placeholder.com/40"
          alt="Default Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
      )}
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {/* Отображение вложений, если они есть */}
        {attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachments.map((url, index) =>
              isImage(url) ? (
                <img
                  key={index}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/150?text=Image+Not+Available";
                  }}
                />
              ) : (
                <div
                  key={index}
                  className="flex items-center space-x-2"
                >
                  <FiFile size={20} className="text-gray-600" />
                  {/* Отображение названия файла без ссылки */}
                  <span className="flex-1 text-blue-700 truncate">
                    {truncateFileName(getFileName(url), 20)}
                  </span>
                  <FiDownload
                    size={20}
                    className="text-gray-600 cursor-pointer"
                    onClick={() => {
                      const filename = getFileName(url);
                      downloadFile(url, filename);
                    }}
                  />
                </div>
              )
            )}
          </div>
        )}
        {/* Отображение отформатированного времени */}
        <span className="block text-xs text-gray-500 mt-1">
          {timestamp}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
