import React from "react";
import { TimeFormatter } from "../timeFormat";
// Импортируем изображение как модуль:
import defaultAvatarImage from "../../assets/Anonumus.jpg";

interface ChatListItemProps {
  avatar?: string; 
  name: string;
  content: string;
  created_at: string;
  unreadCount: number;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  avatar,
  name,
  content,
  created_at,
  unreadCount,
}) => {

  const chosenAvatar =
    !avatar || avatar === "underfiend" ? defaultAvatarImage : avatar;

  return (
    <div className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
      <img
        src={chosenAvatar}
        alt={name}
        className="w-12 h-12 rounded-full mr-3"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">{name}</span>
          <span className="text-sm text-gray-500">
            {TimeFormatter.to24HourFormat(created_at)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 truncate">{content}</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-1 ml-2">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
