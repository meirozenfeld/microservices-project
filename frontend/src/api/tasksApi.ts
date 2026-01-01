import { http } from "./http";
import type { Task } from "../store/tasks/tasks.types";

type TasksResponse = {
    data: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
};

export async function getTasks(): Promise<Task[]> {
    const res = await http.get<TasksResponse>("/tasks");
    return res.data.data;
}


export async function createTask(title: string): Promise<Task> {
    const res = await http.post<Task>("/tasks", { title });
    return res.data;
}

export async function updateTask(
    taskId: string,
    data: Partial<Pick<Task, "status" | "title" | "dueDate">>
): Promise<Task> {
    const res = await http.put<Task>(`/tasks/${taskId}`, data);
    return res.data;
}

export async function deleteTask(taskId: string): Promise<void> {
    await http.delete(`/tasks/${taskId}`);
}

