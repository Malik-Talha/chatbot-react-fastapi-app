const API_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async register(email, password, firstName, lastName) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Registration failed');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Login failed');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }

  async createChat(title = 'New Chat') {
    const res = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to create chat');
    return res.json();
  }

  async getChats() {
    const res = await fetch(`${API_URL}/chats`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch chats');
    return res.json();
  }

  async getChat(chatId) {
    const res = await fetch(`${API_URL}/chats/${chatId}`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch chat');
    return res.json();
  }
}

export default new ApiService();