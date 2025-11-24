import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (!this.socket) return;
    this.socket.emit(event, data);
  }

  sendMessage(chatId, content, stream = false) {
    this.emit('send_message', { chat_id: chatId, content, stream });
  }

  joinChat(chatId) {
    this.emit('join_chat', { chat_id: chatId });
  }
}

export default new SocketService();