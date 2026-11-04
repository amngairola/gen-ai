const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

const request = async (endpoint, options = {}) => {
  console.log(API_URL);
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });

  const raw = await response.text();

  let data;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error("Invalid response received from backend");
  }

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
};

// Send message to Pragya
export const invokeAgent = async (query, conversationId = null) => {
  return request("/api/agent/invoke", {
    method: "POST",
    body: JSON.stringify({ query, conversationId }),
  });
};

// Fetch all previous conversations
export const getConversations = async () => {
  return request("/api/agent/conversations");
};

// Fetch messages of selected conversation
export const getConversationMessages = async (conversationId) => {
  return request(
    `/api/agent/conversations/${encodeURIComponent(conversationId)}/messages`
  );
};
