// UserProfile.tsx
import React, { useState } from "react";
import defaultAvatarImage from "../../assets/Anonumus.jpg";
import UserSettings from "../UserSettings/UserSettings";

const UserProfile: React.FC = ({user}) => {
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false); // Функция закрытия

  return (
    <div>
      {/* Профиль пользователя */}
      <div className="flex items-center justify-between p-3 bg-gray-200">
        <div className="flex items-center">
          <img
            src={defaultAvatarImage}
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
          />
          <span className="ml-3 font-medium">{user.name}</span>
        </div>
        {/* Кнопка для отображения настроек */}
        <button
          className="text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={openSettings}
        >
          ⚙️
        </button>
      </div>

      {/* Показываем настройки пользователя, если состояние showSettings === true */}
      {showSettings && <UserSettings onClose={closeSettings} />}
    </div>
  );
};

export default UserProfile;
