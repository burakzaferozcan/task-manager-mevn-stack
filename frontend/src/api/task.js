import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const createTask = (taskData) => {
  return axios.post(API_URL, taskData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTasks = (userId) => {
  return axios.get(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getSingleTask = (userId, taskId) => {
  return axios.get(`${API_URL}/${userId}/${taskId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTask = (userId, taskId, updatedData) => {
  return axios.put(`${API_URL}/${userId}/${taskId}`, updatedData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteTask = (userId, taskId) => {
  return axios.delete(`${API_URL}/${userId}/${taskId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
