import React from "react";
import defaultAvatarImage from "../../assets/Anonumus.jpg";
const ChatHeader: React.FC = ({receiveName}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-200 border-b">
      <div className="flex items-center">
        <img
          src={defaultAvatarImage}
          alt="Chat Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h1 className="text-lg font-medium">{receiveName}</h1>
        </div>
      </div>
      
    </div>
  );
};

export default ChatHeader;
