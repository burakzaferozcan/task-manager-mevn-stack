<template>
  <div>
    <h1>Tasks</h1>
    <button @click="showCreateTaskModal = true">Create Task</button>
    <ul>
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
        <button @click="editTask(task)">Edit</button>
        <button @click="deleteTask(task._id)">Delete</button>
      </li>
    </ul>
    <div v-if="showCreateTaskModal">
      <h2>Create Task</h2>
      <form @submit.prevent="createTask">
        <input v-model="newTask.title" placeholder="Title" required />
        <textarea
          v-model="newTask.description"
          placeholder="Description"
          required
        ></textarea>
        <input v-model="newTask.due_date" type="date" />
        <button type="submit">Create</button>
        <button @click="showCreateTaskModal = false">Cancel</button>
      </form>
    </div>
    <div v-if="showEditTaskModal">
      <h2>Edit Task</h2>
      <form @submit.prevent="updateTask">
        <input v-model="currentTask.title" placeholder="Title" required />
        <textarea
          v-model="currentTask.description"
          placeholder="Description"
          required
        ></textarea>
        <input v-model="currentTask.due_date" type="date" />
        <button type="submit">Update</button>
        <button @click="showEditTaskModal = false">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { useTaskStore } from "../stores/taskStore";
import { useUserStore } from "../stores/userStore";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const taskStore = useTaskStore();
    const userStore = useUserStore();
    const router = useRouter();

    const tasks = computed(() => taskStore.tasks);
    const userId = computed(() => userStore.user?._id);

    const showCreateTaskModal = ref(false);
    const showEditTaskModal = ref(false);
    const newTask = ref({ title: "", description: "", due_date: "" });
    const currentTask = ref(null);

    const createTask = async () => {
      if (!userId.value) {
        console.error("User ID not found");
        return;
      }
      await taskStore.addTask({ ...newTask.value, userId: userId.value });
      showCreateTaskModal.value = false;
      newTask.value = { title: "", description: "", due_date: "" };
    };

    const editTask = (task) => {
      currentTask.value = { ...task };
      showEditTaskModal.value = true;
    };

    const updateTask = async () => {
      if (!userId.value || !currentTask.value._id) {
        console.error("User ID or Task ID not found");
        return;
      }
      await taskStore.updateTask(
        userId.value,
        currentTask.value._id,
        currentTask.value
      );
      showEditTaskModal.value = false;
      currentTask.value = null;
    };

    const deleteTask = async (taskId) => {
      if (!userId.value) {
        console.error("User ID not found");
        return;
      }
      await taskStore.removeTask(userId.value, taskId);
    };

    onMounted(async () => {
      if (!userStore.isAuthenticated) {
        router.push("/login");
      } else {
        await taskStore.fetchTasks(userId.value);
      }
    });

    return {
      tasks,
      userId,
      showCreateTaskModal,
      showEditTaskModal,
      newTask,
      currentTask,
      createTask,
      editTask,
      updateTask,
      deleteTask,
    };
  },
};
</script>

<style scoped>
button {
  margin-right: 10px;
}
</style>
