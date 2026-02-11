import api from "./api";

// AI Chat API
export const aiAPI = {
  chat: (message, conversationHistory) => api.post("/ai/chat", { message, conversationHistory }),
};
