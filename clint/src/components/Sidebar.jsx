export default function Sidebar({
  onNewChat,
  chatHistory = [],
  activeChatId,
  onSelectChat,
}) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-white/10 bg-[#171717] p-3">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xl font-bold text-black">
          P
        </div>

        <span className="text-lg font-semibold">Pragya</span>
      </div>

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-3 rounded-lg border border-white/20 px-3 py-3 text-sm hover:bg-white/10"
      >
        <span className="text-xl">+</span>
        New chat
      </button>

      {/* Chat History */}
      <div className="mt-8 flex-1 overflow-y-auto">
        <p className="mb-3 px-2 text-xs font-semibold text-gray-500">
          YOUR CHATS
        </p>

        {chatHistory.length === 0 ? (
          <p className="px-2 py-3 text-xs text-gray-500">
            No previous conversations
          </p>
        ) : (
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full truncate rounded-lg px-3 py-3 text-left text-sm transition ${
                  activeChatId === chat.id
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                title={chat.title}
              >
                {chat.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 border-t border-white/10 px-2 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 font-semibold">
          A
        </div>

        <div>
          <p className="text-sm font-medium">User</p>
          <p className="text-xs text-gray-500">Pragya AI</p>
        </div>
      </div>
    </aside>
  );
}
