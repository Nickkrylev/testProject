import React from 'react';

type AuthWrapperProps = {
  children: React.ReactNode;
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-around min-h-screen bg-gray-100">
      <h1 className="text-4xl text-teal-900 font-bold font-mono ">  Welcome to Messenger App</h1>
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper; // Экспорт по умолчанию
