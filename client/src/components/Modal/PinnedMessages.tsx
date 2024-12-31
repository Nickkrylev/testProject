import React from "react";

interface PinnedMessagesProps {
  messages: { id: number; text: string }[];
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({ messages }) => {
  return (
    <div className="p-4 bg-yellow-100 border-b">
      <h3 className="font-bold mb-2">Закрепленные сообщения:</h3>
      {messages.length > 0 ? (
        <ul>
          {messages.map((message) => (
            <li key={message.id} className="text-sm text-gray-800">
              {message.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Нет закрепленных сообщений</p>
      )}
    </div>
  );
};

export default PinnedMessages;
