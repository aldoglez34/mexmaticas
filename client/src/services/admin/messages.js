import axios from "axios";

export const fetchMessages = () => axios.get("/adminapi/messages/all");

export const markSeen = (msgId) =>
  axios.put(`/adminapi/messages/markSeen/${msgId}`);

export const respondMsg = (data) =>
  axios.put("/adminapi/messages/respond", data);

export const deleteMessage = (messageId) =>
  axios.put(`/adminapi/messages/delete/${messageId}`);
