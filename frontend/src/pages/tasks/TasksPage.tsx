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
    const { items, status, error } = useAppSelector(state => state.tasks);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchTasks());
        }
    }, [dispatch, status]);

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

                <button onClick={() => navigate("/tasks/new")}>
                    + New Task
                </button>
            </div>

            {/* Content */}
            {status === "loading" && (
                <LoadingState message="Loading tasks..." />
            )}

            {status === "failed" && (
                <p role="alert">Error: {error}</p>
            )}

            {status === "succeeded" && items.length === 0 && (
                <EmptyState message="No tasks yet. Create your first task." />
            )}

            {status === "succeeded" && items.length > 0 && (
                <TaskList tasks={items} />
            )}
        </div>
    );
}
