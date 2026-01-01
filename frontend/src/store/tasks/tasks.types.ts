export type TaskStatus = "todo" | "done";

export type Task = {
    _id: string;
    title: string;
    status: TaskStatus;
    dueDate?: string | null;
    createdAt: string;
    updatedAt?: string;
};
