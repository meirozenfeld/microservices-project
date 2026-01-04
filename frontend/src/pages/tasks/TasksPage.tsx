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
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <h1>My Tasks</h1>
            </div>

            {/* Content */}
            {fetch.status === "loading" && (
                <LoadingState message="Loading tasks..." />
            )}

            {fetch.status === "failed" && (
                <p role="alert">Error: {fetch.error}</p>
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
