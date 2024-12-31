// src/components/Chat/ChatWindow.tsx
import React, { useState, useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { findConversation, uploadFile } from "../../API/ChatList"; // Импортируем функции из API

interface IUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface IMessage {
  id: string; // Изменено с number на string
  text: string;
  timestamp: string;
  senderId: string;
  isOwn: boolean;
  attachments: string[];
  avatarUrl?: string; // Добавлено для отображения аватаров
}

interface ChatWindowProps {
  user: IUser; // Пользователь, от имени которого идет переписка
  receiverId: string; // ID получателя, с которым ведется переписка
  receiveName: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, receiverId, receiveName }) => {
  const [messages, setMessages] = useState<IMessage[]>([]); // Сообщения чата
  const [loading, setLoading] = useState<boolean>(true); // Индикатор загрузки
  const [error, setError] = useState<string | null>(null); // Ошибка при загрузке
  const ws = useRef<WebSocket | null>(null); // Ссылка на WebSocket

  // Функция для подключения к WebSocket
  const connectWebSocket = () => {
    // Убедитесь, что вы используете правильный URL WebSocket
    const socketUrl = `ws://localhost:3000/ws`;
    ws.current = new WebSocket(socketUrl);

    // Обработчик открытия соединения
    ws.current.onopen = () => {
      console.log("WebSocket соединение установлено");
      // По необходимости можно отправить событие при подключении
      // Например, аутентификацию или инициализацию
    };

    // Обработчик получения сообщений
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleIncomingMessage(message);
      } catch (err) {
        console.error("Ошибка при разборе сообщения WebSocket:", err);
      }
    };

    // Обработчик ошибок
    ws.current.onerror = (err) => {
      console.error("WebSocket ошибка:", err);
    };

    // Обработчик закрытия соединения
    ws.current.onclose = (event) => {
      console.log(`WebSocket соединение закрыто: код=${event.code}, причина=${event.reason}`);
      // По желанию можно реализовать авто-переподключение
      // setTimeout(connectWebSocket, 5000);
    };
  };

  // Обработка входящих сообщений от сервера
  const handleIncomingMessage = (message: any) => {
    const { type, data } = message;

    switch (type) {
      case "newMessage":
        setMessages((prev) => [...prev, formatMessage(data)]);
        break;
      case "updatedMessage":
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.id ? formatMessage(data) : msg))
        );
        break;
      case "deletedMessage":
        setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
        break;
      case "allMessages":
        setMessages(data.map((msg: any) => formatMessage(msg)));
        break;
      case "contacts":
        // Обработка списка контактов, если необходимо
        break;
      case "error":
        console.error("Сообщение об ошибке от сервера:", data.message);
        break;
      default:
        console.warn("Неизвестный тип сообщения:", type);
    }
  };

  // Форматирование сообщения для компонента
  const formatMessage = (msg: any): IMessage => ({
    id: msg.id, // Теперь id остается строкой
    text: msg.content,
    timestamp: new Date(msg.created_at).toLocaleTimeString(),
    senderId: msg.sender_id,
    isOwn: msg.sender_id === user.id,
    attachments: msg.attachments || [],
    avatarUrl: msg.avatarUrl, // Добавлено для отображения аватаров
  });

  // Загрузка сообщений при первом рендере или смене получателя
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Вызываем функцию для получения сообщений через API
        const data = await findConversation(user.id, receiverId);

        // Преобразуем данные с сервера в формат компонента
        const formattedMessages = data.map((msg: any) => formatMessage(msg));

        setMessages(formattedMessages);
      } catch (err) {
        setError("Не удалось загрузить сообщения.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [user.id, receiverId]);

  // Инициализация WebSocket при монтировании и очистка при размонтировании
  useEffect(() => {
    connectWebSocket();

    // Очистка WebSocket при размонтировании компонента
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiverId]); // Переподключение при смене получателя, если необходимо

  // Функция отправки сообщения через WebSocket
  const sendMessageViaWebSocket = async (text: string, attachmentUrls: string[]) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        event: "sendMessage",
        data: {
          senderId: user.id,
          receiverId: receiverId,
          text,
          attachments: attachmentUrls, // Отправляем URLs вложений
        },
      };
      ws.current.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket соединение не установлено.");
    }
  };

  // Обработка отправки сообщения из `MessageInput`
  const handleSend = async (text: string, attachmentFiles: File[]) => {
    if (!text && attachmentFiles.length === 0) return;

    setLoading(true);

    try {
      let attachmentUrls: string[] = [];

      // Если есть вложения, загружаем их через API и получаем URLs
      if (attachmentFiles.length > 0) {
        // Предполагается, что `uploadFile` возвращает URL загруженного файла
        const uploadPromises = attachmentFiles.map((file) =>
          uploadFile(user.id, receiverId, file)
        );

        attachmentUrls = await Promise.all(uploadPromises);
      }

      // Отправляем сообщение через WebSocket с текстом и URLs вложений
      await sendMessageViaWebSocket(text, attachmentUrls);

      // Добавляем сообщение локально с временным ID (опционально)
      const tempMessage: IMessage = {
        id: uuidv4(), // Используем UUID для уникальности
        text,
        timestamp: new Date().toLocaleTimeString(),
        senderId: user.id,
        isOwn: true,
        attachments: attachmentUrls,
      };

      setMessages((prev) => [...prev, tempMessage]);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setError("Не удалось отправить сообщение.");
    } finally {
      setLoading(false);
    }
  };

  // Обработка редактирования сообщения через WebSocket
  const handleEdit = async (messageId: string, newText: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        event: "editMessage",
        data: {
          messageId: messageId,
          newText,
        },
      };
      ws.current.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket соединение не установлено.");
    }
  };

  // Обработка удаления сообщения через WebSocket
  const handleDelete = async (messageId: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const payload = {
        event: "deleteMessage",
        data: {
          messageId: messageId,
        },
      };
      ws.current.send(JSON.stringify(payload));
    } else {
      console.error("WebSocket соединение не установлено.");
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white h-screen">
      <ChatHeader receiveName={receiveName} />

      {/* Загрузка или отображение ошибок */}
      {loading && <p className="p-4 text-gray-500">Загрузка сообщений...</p>}
      {error && <p className="p-4 text-red-500">{error}</p>}

      {/* Список сообщений */}
      {!loading && !error && (
        <MessageList messages={messages} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Поле ввода и прикрепления файлов */}
      <MessageInput onSend={handleSend} userId={user.id} receiverId={receiverId} />
    </div>
  );
};

export default ChatWindow;
