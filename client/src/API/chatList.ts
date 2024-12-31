import axios from 'axios';
import API_BASE_URL from './config';  // или ваш путь к конфигу

export const fetchChatList = async (userId: string) => {
  try {
    // Меняем POST на GET и путь на /chat/list
    const response = await axios.get(`${API_BASE_URL}/messages/allChatbyID/${userId}`);
    return response.data;
  } catch (error) {
    // Меняем сообщение об ошибке
    throw error.response?.data || 'An error occurred while fetching the chat list';
  }
};

export const searcByIDorNickname = async (searchIdNickname: string) => {
    try {
      // Меняем POST на GET и путь на /chat/list
      const response = await axios.get(`${API_BASE_URL}/user/${searchIdNickname}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'An error occurred while fetching the chat list';
    }
  };


  export const findConversation= async (userId: string, receiver_Id: string) => {
    try {
      // Меняем POST на GET и путь на /chat/list
      const response = await axios.get(`${API_BASE_URL}/messages/conversation/${userId}/${receiver_Id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'An error occurred while fetching the chat list';
    }
  };
  
  export const sendMessage = async (userId: string, receiverId: string, message: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages/`, {
        sender_id: userId,
        receiver_id: receiverId,
        content:message,
      });
      return response.data; // Возвращаем данные успешного запроса
    } catch (error) {
      throw error.response?.data || "An error occurred while sending the message";
    }
  };

  export const uploadFile = async (senderId: string, messageId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      // Изменяем URL для правильного формирования маршрута
      const response = await axios.post(
        `${API_BASE_URL}/attachments/${senderId}/${messageId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return response.data; // Возвращаем данные успешного запроса
    } catch (error) {
      throw error.response?.data || "An error occurred while uploading the file";
    }
  };
  
  