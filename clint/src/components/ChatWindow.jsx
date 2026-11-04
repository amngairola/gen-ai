import Message from "./Message";
import WelcomeScreen from "./WelcomeScreen";
import ChatInput from "./ChatInput";
import Header from "./Header";

export default function ChatWindow({
  messages,
  onSend,
  loading,
  loadingHistory,
  onToggleSidebar,
}) {
  return (
    <>
      <Header onToggleSidebar={onToggleSidebar} />

      <div className="flex min-h-0 flex-1 flex-col">
        {loadingHistory ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <WelcomeScreen onSelect={onSend} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl py-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}

              {loading && (
                <div className="px-4 py-5 text-sm text-gray-400">
                  Pragya is thinking...
                </div>
              )}
            </div>
          </div>
        )}

        <ChatInput onSend={onSend} loading={loading || loadingHistory} />
      </div>
    </>
  );
}
