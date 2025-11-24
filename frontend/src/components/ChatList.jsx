export default function ChatList({ chats, currentChatId, onSelectChat, onNewChat, onLogout }) {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          + New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-4 cursor-pointer hover:bg-gray-700 border-b border-gray-700 ${
              currentChatId === chat.id ? 'bg-gray-700' : ''
            }`}
          >
            <div className="font-semibold truncate">{chat.title}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(chat.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}