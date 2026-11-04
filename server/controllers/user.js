import { randomUUID } from "node:crypto";
import supabase from "../config/supabase.js";
import { main } from "../agent/agent.js";

export const invokeAgent = async (req, res) => {
  try {
    const { query, conversationId } = req.body;

    // 1. Validate query
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // 2. Create or reuse conversation ID
    const id = conversationId || randomUUID();

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    console.log("Processing conversation:", id);

    // 3. Check if conversation exists
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (conversationError) throw conversationError;

    // 4. Create new conversation if necessary
    if (!conversation) {
      const { error } = await supabase.from("conversations").insert({
        id,
        title: query.trim().slice(0, 80),
      });

      if (error) throw error;
    }

    // 5. Retrieve previous conversation history
    const { data: previousMessages, error: historyError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (historyError) throw historyError;

    // Reverse to maintain chronological order
    const history = (previousMessages || []).reverse();

    // 6. Save user message
    const { error: userMessageError } = await supabase.from("messages").insert({
      conversation_id: id,
      role: "user",
      content: query.trim(),
    });

    if (userMessageError) throw userMessageError;

    // 7. Invoke Pragya with conversation history
    const result = await main(query.trim(), history);

    if (!result) {
      throw new Error("Pragya returned an empty response");
    }

    // 8. Save assistant response
    const { error: assistantMessageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        role: "assistant",
        content: result,
      });

    if (assistantMessageError) throw assistantMessageError;

    // 9. Update conversation timestamp
    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 10. Return response
    return res.status(200).json({
      success: true,
      conversationId: id,
      query: query.trim(),
      response: result,
    });
  } catch (error) {
    console.error("Pragya controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your message. Please try again.",
    });
  }
};

// GET: Load all previous conversations
export const getConversations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, created_at, updated_at")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      conversations: data || [],
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversations",
    });
  }
};

// GET: Load messages of a particular conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id, title")
      .eq("id", conversationId)
      .maybeSingle();

    if (conversationError) throw conversationError;

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (messagesError) throw messagesError;

    return res.status(200).json({
      success: true,
      conversation,
      messages: messages || [],
    });
  } catch (error) {
    console.error("Get conversation messages error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load conversation messages",
    });
  }
};
