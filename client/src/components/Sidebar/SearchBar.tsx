import React, { useState, useEffect } from "react";
import { searcByIDorNickname } from "../../API/ChatList";
import { useNavigate } from "react-router-dom";
import defaultAvatarImage from "../../assets/Anonumus.jpg";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  nickname: string;
  phone_number?: string;
  avatarUrl?: string;
}

interface SearchBarProps {
  onChatSelect: (chat: { userId: string; name: string; avatarUrl?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onChatSelect ,user}) => {
  const [query, setQuery] = useState<string>(""); // Поле для поиска
  const [result, setResult] = useState<User | null>(null); // Результат поиска (1 пользователь)
  const [loading, setLoading] = useState<boolean>(false); // Индикатор загрузки
  const [error, setError] = useState<string | null>(null); // Ошибки

  const navigate = useNavigate(); // Хук для перехода по страницам

  useEffect(() => {
    if (!query || query === user.nickname ||  query === user.id) {
      setResult(null); 
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const delayDebounceFn = setTimeout(() => {
      console.log("Ищем:", query, user.nickname,user.id );
      
        searcByIDorNickname(query) 
        .then((res: User) => {
          console.log("Ответ API:", res);
          if (res && res.id) {
            setResult(res); // Сохраняем объект пользователя, если он найден
          } else {
            setResult(null); // Если API вернул "ничего"
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Ошибка при поиске"); // Ловим ошибки API
          setLoading(false);
        });
    }, 1000); // Задержка для "дебаунса"

    return () => clearTimeout(delayDebounceFn); // Очищаем таймаут при новом вводе
  }, [query]);

  return (
    <div className="p-2">
      {/* Поле для поиска */}
      <input
        type="text"
        placeholder="Search by ID or Nickname..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Индикатор загрузки */}
      {loading && (
        <div className="mt-2 flex items-center">
          <svg
            className="animate-spin h-5 w-5 text-blue-500 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Поиск...</span>
        </div>
      )}

      {/* Ошибка */}
      {error && <div className="mt-2 text-red-500">{error}</div>}

      {/* Результат поиска */}
      {!loading && query && (
        <div className="mt-2">
          {result ? (
            <div className="bg-white border rounded-md p-2 shadow-md flex items-center">
              <img
                src={result.avatarUrl || defaultAvatarImage}
                alt={`${result.nickname} avatar`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{result.name || result.nickname}</p>
                <p className="text-gray-500 text-sm">Nickname: {result.nickname}</p>
              </div>
              <button
                onClick={() => {
                  // Передаем выбранного пользователя в onChatSelect
                  onChatSelect({
                    userId: result.id,
                    name: result.name || result.nickname,
                    avatarUrl: result.avatarUrl,
                  });
                  // navigate(`/chat/${result.id}`); // Переходим на страницу чата
                }}
                className="ml-auto bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Chat
              </button>
            </div>
          ) : (
            <div className="mt-2 text-gray-500">No found: "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
