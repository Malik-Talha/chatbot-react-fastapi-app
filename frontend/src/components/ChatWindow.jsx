import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, streamingMessage, isStreaming }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <div>Start a conversation</div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                  msg.sender_type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender_type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isStreaming && streamingMessage && (
            <div className="mb-4 flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-200">
                <div className="whitespace-pre-wrap break-words">
                  {streamingMessage}
                  <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}