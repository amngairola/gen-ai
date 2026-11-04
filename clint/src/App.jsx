import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

import {
  invokeAgent,
  getConversations,
  getConversationMessages,
} from "./agentService.js";

import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [conversationId, setConversationId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load conversations from database
  const loadConversations = async () => {
    try {
      const result = await getConversations();
      setConversations(result.conversations || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // Load history when application starts
  useEffect(() => {
    loadConversations();
  }, []);

  // Select and load an existing conversation
  const selectConversation = async (id) => {
    if (loading || loadingHistory) return;

    if (id === conversationId) return;

    setLoadingHistory(true);

    try {
      const result = await getConversationMessages(id);

      setConversationId(id);
      setMessages(result.messages || []);
    } catch (error) {
      console.error("Failed to load chat:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Send message to Pragya
  const sendMessage = async (text) => {
    const query = text?.trim();

    if (!query || loading || loadingHistory) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const result = await invokeAgent(query, conversationId);

      if (!result.success) {
        throw new Error(result.message || "Agent request failed");
      }

      // Save conversation ID for subsequent messages
      setConversationId(result.conversationId);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.response || "No response received.",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh Sidebar history
      await loadConversations();
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Start a fresh conversation
  const newChat = () => {
    if (loading || loadingHistory) return;

    setMessages([]);
    setConversationId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121] text-white">
      {sidebarOpen && (
        <Sidebar
          onNewChat={newChat}
          chatHistory={conversations}
          activeChatId={conversationId}
          onSelectChat={selectConversation}
        />
      )}

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatWindow
          messages={messages}
          loading={loading}
          loadingHistory={loadingHistory}
          onSend={sendMessage}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
      </main>
    </div>
  );
}
