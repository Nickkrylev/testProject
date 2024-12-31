// src/components/Chat/MessageList.tsx
import React, { useState } from "react";
import MessageItem from "./MessageItem";
import Modal from "../Modal/Modal";

interface Message {
  id: string; // Изменено с number на string
  text: string;
  timestamp: string;
  isOwn: boolean;
  attachments: string[];
  avatarUrl?: string; // Добавлено для передачи аватаров
}

interface MessageListProps {
  messages: Message[];
  onEdit: (messageId: string, newText: string) => void; // Изменено с number на string
  onDelete: (messageId: string) => void; // Изменено с number на string
}

const MessageList: React.FC<MessageListProps> = ({ messages, onEdit, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Открыть модальное окно с выбранным сообщением
  const handleLongClick = (message: Message) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  // Закрыть модальное окно
  const handleCloseModal = () => {
    setSelectedMessage(null);
    setModalOpen(false);
  };

  // Обработка редактирования
  const handleEdit = () => {
    if (selectedMessage) {
      const newText = prompt("Введите новый текст сообщения", selectedMessage.text);
      if (newText && newText.trim() !== "") {
        onEdit(selectedMessage.id, newText.trim());
      }
    }
    handleCloseModal();
  };

  // Обработка удаления
  const handleDelete = () => {
    if (selectedMessage) {
      if (window.confirm("Вы уверены, что хотите удалить это сообщение?")) {
        onDelete(selectedMessage.id);
      }
    }
    handleCloseModal();
  };

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
      {messages.map((message) => (
        <div
          key={message.id}
          onContextMenu={(e) => {
            e.preventDefault();
            handleLongClick(message);
          }}
        >
          <MessageItem
            text={message.text}
            timestamp={message.timestamp}
            isOwn={message.isOwn}
            attachments={message.attachments}
            avatarUrl={message.isOwn ? undefined : message.avatarUrl} // Передача аватара для других пользователей
          />
        </div>
      ))}
      {isModalOpen && selectedMessage && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h3 className="font-bold mb-4">Выберите действие</h3>
          <p className="text-gray-600 mb-4">{selectedMessage.text}</p>
          <div className="flex space-x-2">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              onClick={handleEdit}
            >
              Изменить
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleDelete}
            >
              Удалить
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleCloseModal}
            >
              Закрыть
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MessageList;
