import axios from 'axios';
import { UserRegistrationDTO } from './dto/UserRegistrationDTO';
import { LoginDTO } from './dto/LoginDTO';
import API_BASE_URL from './config'; 

export const registerUser = async (data: UserRegistrationDTO) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'An error occurred during registration';
  }
};
export const loginUser =  async (data: LoginDTO) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'An error occurred during rlogin';
    }
  };
