import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "./tasks.types";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../../api/tasksApi";

type Status = "idle" | "loading" | "succeeded" | "failed";

type TasksState = {
    items: Task[];

    fetch: {
        status: Status;
        error: string | null;
    };

    mutations: {
        create: {
            status: Status;
            error: string | null;
        };
        toggleById: Record<string, { status: Status; error: string | null }>;
        deleteById: Record<string, { status: Status; error: string | null }>;
    };
};

const initialState: TasksState = {
    items: [],
    fetch: {
        status: "idle",
        error: null,
    },
    mutations: {
        create: { status: "idle", error: null },
        toggleById: {},
        deleteById: {},
    },
};

/* ======================
   Async Thunks
====================== */

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, { rejectWithValue }) => {
        try {
            return await getTasks();
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to load tasks"
            );
        }
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (title: string, { rejectWithValue }) => {
        try {
            return await createTask(title);
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to create task"
            );
        }
    }
);

export const markTaskDone = createAsyncThunk(
    "tasks/markTaskDone",
    async (taskId: string, { rejectWithValue }) => {
        try {
            return await updateTask(taskId, { status: "done" });
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update task"
            );
        }
    }
);

export const removeTask = createAsyncThunk(
    "tasks/removeTask",
    async (taskId: string, { rejectWithValue }) => {
        try {
            await deleteTask(taskId);
            return taskId;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to delete task"
            );
        }
    }
);

/* ======================
   Slice
====================== */

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            /* FETCH */
            .addCase(fetchTasks.pending, (state) => {
                state.fetch.status = "loading";
                state.fetch.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.fetch.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.fetch.status = "failed";
                state.fetch.error = action.payload as string;
            })

            /* CREATE */
            .addCase(addTask.pending, (state) => {
                state.mutations.create.status = "loading";
                state.mutations.create.error = null;
            })
            .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.mutations.create.status = "succeeded";
                state.items.unshift(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.mutations.create.status = "failed";
                state.mutations.create.error = action.payload as string;
            })

            /* TOGGLE DONE */
            .addCase(markTaskDone.pending, (state, action) => {
                const id = action.meta.arg;
                state.mutations.toggleById[id] = { status: "loading", error: null };

                const task = state.items.find((t) => t._id === id);
                if (task) task.status = "done";
            })
            .addCase(markTaskDone.fulfilled, (state, action) => {
                const task = action.payload;
                state.mutations.toggleById[task._id].status = "succeeded";

                const index = state.items.findIndex((t) => t._id === task._id);
                if (index !== -1) state.items[index] = task;
            })
            .addCase(markTaskDone.rejected, (state, action) => {
                const id = action.meta.arg;
                state.mutations.toggleById[id].status = "failed";
                state.mutations.toggleById[id].error = action.payload as string;

                const task = state.items.find((t) => t._id === id);
                if (task) task.status = "todo";
            })

            /* DELETE */
            .addCase(removeTask.pending, (state, action) => {
                const id = action.meta.arg;
                state.mutations.deleteById[id] = { status: "loading", error: null };
            })
            .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
                const id = action.payload;
                state.items = state.items.filter((t) => t._id !== id);
                state.mutations.deleteById[id].status = "succeeded";
            })
            .addCase(removeTask.rejected, (state, action) => {
                const id = action.meta.arg;
                state.mutations.deleteById[id].status = "failed";
                state.mutations.deleteById[id].error = action.payload as string;
            });
    },
});

export default tasksSlice.reducer;
