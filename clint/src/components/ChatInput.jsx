import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || loading) return;

    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full px-4 pb-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-3 rounded-2xl border border-white/15 bg-[#303030] p-3 shadow-lg focus-within:border-white/30">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={loading ? "AI is thinking..." : "Message GPT..."}
            disabled={loading}
            rows={1}
            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-50"
          />

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? "..." : "↑"}
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}
