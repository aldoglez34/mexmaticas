import axios from "axios";

export const newConversation = (data) =>
  axios.post("/conversationapi/conversations/new", data);

export const fetchConversations = (userType, userId) =>
  axios.get(`/conversationapi/conversations/fetch/${userType}/${userId}`);

export const fetchPendingMessages = (userType, userId) =>
  axios.get(
    `/conversationapi/conversations/pendingMessages/${userType}/${userId}`
  );

export const newMessage = (data) =>
  axios.put("/conversationapi/conversations/message/new", data);

export const setConversationSeen = (userType, userId, conversationId) =>
  axios.put(
    `/conversationapi/conversations/seen/${userType}/${userId}/${conversationId}`
  );

export const deleteConversation = (conversationId) =>
  axios.put(
    `/conversationapi/conversations/delete//${conversationId}`
  );
