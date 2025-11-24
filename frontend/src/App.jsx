import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import api from './services/api';
import socket from './services/socket';

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamMode, setStreamMode] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadChats();
      setupSocket();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (currentChatId) {
      loadChatMessages(currentChatId);
      socket.joinChat(currentChatId);
    }
  }, [currentChatId]);

  const loadUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      api.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async () => {
    try {
      const chatsData = await api.getChats();
      setChats(chatsData);
      if (chatsData.length > 0 && !currentChatId) {
        setCurrentChatId(chatsData[0].id);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const chatData = await api.getChat(chatId);
      setMessages(chatData.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const setupSocket = () => {
    const token = localStorage.getItem('token');
    socket.connect(token);

    socket.on('message_saved', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('ai_stream_start', () => {
      setIsStreaming(true);
      setStreamingMessage('');
    });

    socket.on('ai_stream_chunk', (data) => {
      setStreamingMessage((prev) => prev + data.chunk);
    });

    socket.on('ai_stream_end', (message) => {
      setIsStreaming(false);
      setStreamingMessage('');
      setMessages((prev) => [...prev, message]);
    });
  };

  const handleLogin = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
  };

  const handleRegister = async (email, password, firstName, lastName) => {
    const data = await api.register(email, password, firstName, lastName);
    setUser(data.user);
  };

  const handleLogout = () => {
    api.clearToken();
    socket.disconnect();
    setUser(null);
    setChats([]);
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleNewChat = async () => {
    try {
      const newChat = await api.createChat();
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleSendMessage = (content) => {
    if (!currentChatId) return;
    socket.sendMessage(currentChatId, content, streamMode);
  };

  const handleToggleStream = () => {
    setStreamMode((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onToggle={() => setShowRegister(false)}
      />
    ) : (
      <Login onLogin={handleLogin} onToggle={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="h-screen flex">
      <ChatList
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        {currentChatId ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold">
                {chats.find((c) => c.id === currentChatId)?.title || 'Chat'}
              </h2>
            </div>
            <ChatWindow
              messages={messages}
              streamingMessage={streamingMessage}
              isStreaming={isStreaming}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isStreaming}
              streamMode={streamMode}
              onToggleStream={handleToggleStream}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-4">👋</div>
              <div>Select a chat or create a new one</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}