import React from "react";
import SearchBar from "./SearchBar";
import ChatList from "./ChatList";
import UserProfile from "./UserProfile";

// Обновление интерфейса пропсов
// interface SidebarProps {
//   user: { id: string };
//   onChatSelect: (chat: { userId: string; name: string; avatarUrl?: string }) => void;
// }

const Sidebar: React.FC = ({ user, onChatSelect }) => {
  return (
    <div className="flex flex-col w-1/4 bg-gray-100 h-screen">
      {/* Компонент профиля пользователя */}
      <UserProfile user={user} />
      {/* Компонент поиска */}
      <SearchBar user={user} onChatSelect={onChatSelect} />
      {/* Передача onChatSelect в ChatList */}
      <ChatList user={user} onChatSelect={onChatSelect} />
    </div>
  );
};

export default Sidebar;
