import { useState } from 'react';

export default function MessageInput({ onSendMessage, disabled, streamMode, onToggleStream }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-2 flex items-center justify-end">
          <label className="flex items-center cursor-pointer">
            <span className="text-sm text-gray-600 mr-2">Stream Response</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={streamMode}
                onChange={onToggleStream}
                className="sr-only"
              />
              <div
                className={`block w-10 h-6 rounded-full ${
                  streamMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                  streamMode ? 'transform translate-x-4' : ''
                }`}
              ></div>
            </div>
          </label>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={disabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}