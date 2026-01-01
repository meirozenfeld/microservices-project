import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
    fetchTasks,
    markTaskDone,
    removeTask,
} from "../../store/tasks/tasksSlice";

export default function TasksPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, status, error } = useAppSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    if (status === "loading") {
        return <p>Loading tasks...</p>;
    }

    if (status === "failed") {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>My Tasks</h1>

            {/* ✅ כפתור בדיקה ל־NewTaskPage */}
            <button
                onClick={() => navigate("/tasks/new")}
                style={{ marginBottom: 16 }}
            >
                + New Task
            </button>
            <ul>
                {items.map((task) => (
                    <li key={task._id}>
                        <span
                            style={{
                                textDecoration:
                                    task.status === "done" ? "line-through" : "none",
                            }}
                        >
                            {task.title}
                        </span>

                        {task.status !== "done" && (
                            <button onClick={() => dispatch(markTaskDone(task._id))}>
                                Done
                            </button>
                        )}

                        <button onClick={() => dispatch(removeTask(task._id))}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
