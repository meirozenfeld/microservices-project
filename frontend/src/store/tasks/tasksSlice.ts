import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "./tasks.types";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../../api/tasksApi";

type TasksState = {
    items: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};

const initialState: TasksState = {
    items: [],
    status: "idle",
    error: null,
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
            return rejectWithValue(err.response?.data?.message || "Failed to load tasks");
        }
    }
);

export const addTask = createAsyncThunk(
    "tasks/addTask",
    async (title: string, { rejectWithValue }) => {
        try {
            return await createTask(title);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to create task");
        }
    }
);

export const markTaskDone = createAsyncThunk(
    "tasks/markTaskDone",
    async (taskId: string, { rejectWithValue }) => {
        try {
            return await updateTask(taskId, { status: "done" });
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to update task");
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
            return rejectWithValue(err.response?.data?.message || "Failed to delete task");
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

            /* MARK DONE – optimistic */
            .addCase(markTaskDone.pending, (state, action) => {
                const task = state.items.find(t => t._id === action.meta.arg);
                if (task) {
                    task.status = "done";
                }
            })
            .addCase(markTaskDone.rejected, (state, action) => {
                const taskId = action.meta.arg;
                const task = state.items.find(t => t._id === taskId);
                if (task) {
                    task.status = "todo";
                }
                state.error = action.payload as string;
            })

            /* FETCH */
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })

            /* ADD */
            .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.items.unshift(action.payload);
            })

            /* MARK DONE */
            .addCase(markTaskDone.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.items.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })

            /* DELETE */
            .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(t => t._id !== action.payload);
            });
    },
});

export default tasksSlice.reducer;
