import React, { useEffect, useState } from "react";
import ChatListItem from "./ChatListItem";
import { fetchChatList } from "../../API/ChatList"; // Импорт функции для получения списка чатов

interface Chat {
  userId: number;
  avatar: string;
  name: string;
  content: string;
  created_at: string;
  unreadCount: number;
}

interface ChatListProps {
  user: { id: string }; // Пропс для текущего пользователя
  onChatSelect: (chat: Chat | null) => void; // Колбэк для выбора чата
}

const ChatList: React.FC<ChatListProps> = ({ user, onChatSelect }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const chatList = await fetchChatList(user.id); // Получаем список чатов для текущего пользователя
        setChats(chatList);
        console.log(chats);
      } catch (error) {
        console.error("Ошибка при загрузке чатов:", error);
        setError(
          typeof error === "string" ? error : "Не удалось загрузить список чатов"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user.id]);

  if (loading) {
    return <div className="text-gray-500 p-4">Loading chats...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex-grow overflow-y-auto">
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.userId}
            onClick={() => onChatSelect(chat)} // Выбираем чат при клике
            className="cursor-pointer hover:bg-gray-100"
          >
            <ChatListItem {...chat} />
          </div>
        ))
      ) : (
        <div className="text-gray-500 p-4">No dialogs</div>
      )}
    </div>
  );
};

export default ChatList;
