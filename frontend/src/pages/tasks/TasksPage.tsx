import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { fetchTasks } from "../../store/tasks/tasksSlice";
import TaskList from "../../components/tasks/TaskList";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";

export default function TasksPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { items, fetch } = useAppSelector(state => state.tasks);

    useEffect(() => {
        if (fetch.status === "idle") {
            dispatch(fetchTasks());
        }
    }, [dispatch, fetch.status]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">My Tasks</h1>

                <button
                    onClick={() => navigate("/tasks/new")}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryHover"
                >
                    New Task
                </button>
            </div>

            {/* Content */}
            {fetch.status === "loading" && (
                <LoadingState message="Loading tasks…" />
            )}

            {fetch.status === "failed" && (
                <p role="alert" className="text-sm text-red-400">
                    Error: {fetch.error}
                </p>
            )}

            {fetch.status === "succeeded" && items.length === 0 && (
                <EmptyState
                    message="No tasks yet. Create your first task."
                    actionLabel="New Task"
                    onAction={() => navigate("/tasks/new")}
                />
            )}

            {fetch.status === "succeeded" && items.length > 0 && (
                <TaskList tasks={items} />
            )}
        </div>
    );
}
