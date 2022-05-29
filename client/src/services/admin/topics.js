import axios from "axios";

export const fetchTopic = (courseId, topicId) =>
  axios.get(`/adminapi/topics/${courseId}/${topicId}`);

export const fetchAvailableDifficulties = (courseId, topicId) =>
  axios.get(`/adminapi/topics/difficulties/${courseId}/${topicId}`);

export const updateTopicName = (data) =>
  axios.put("/adminapi/topics/update/name", data);

export const updateTopicSubject = (data) =>
  axios.put("/adminapi/topics/update/subject", data);

export const updateTopicDescription = (data) =>
  axios.put("/adminapi/topics/update/description", data);

export const updateTopicFreestyleTimer = (data) =>
  axios.put("/adminapi/topics/update/timer", data);

export const newTopic = (topicData) =>
  axios.put("/adminapi/topics/new", topicData);

export const updateTopicOrder = (data) =>
  axios.put("/adminapi/topics/update/order", data);

export const deleteTopic = (data) => axios.put("/adminapi/topics/delete", data);
