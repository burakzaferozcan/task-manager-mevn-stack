import { defineStore } from "pinia";
import {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} from "../api/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    tasks: [],
    task: null,
  }),
  actions: {
    async fetchTasks(userId) {
      try {
        const response = await getTasks(userId);
        this.tasks = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async addTask(taskData) {
      try {
        await createTask(taskData);
        this.fetchTasks(taskData.userId);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSingleTask(userId, taskId) {
      try {
        const response = await getSingleTask(userId, taskId);
        this.task = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async updateTask(userId, taskId, updatedData) {
      try {
        await updateTask(userId, taskId, updatedData);
        this.fetchTasks(userId);
      } catch (error) {
        console.error(error);
      }
    },
    async removeTask(userId, taskId) {
      try {
        await deleteTask(userId, taskId);
        this.fetchTasks(userId);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
