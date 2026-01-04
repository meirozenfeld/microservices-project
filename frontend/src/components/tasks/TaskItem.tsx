import type { Task } from "../../store/tasks/tasks.types";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
    markTaskDone,
    removeTask,
} from "../../store/tasks/tasksSlice";

type Props = {
    task: Task;
};

export default function TaskItem({ task }: Props) {
    const dispatch = useAppDispatch();

    const toggleState = useAppSelector(
        (state) => state.tasks.mutations.toggleById[task._id]
    );
    const deleteState = useAppSelector(
        (state) => state.tasks.mutations.deleteById[task._id]
    );

    const isToggling = toggleState?.status === "loading";
    const isDeleting = deleteState?.status === "loading";

    const handleMarkDone = () => {
        if (isToggling) return;
        dispatch(markTaskDone(task._id));
    };

    const handleDelete = () => {
        if (isDeleting) return;

        const confirmed = window.confirm(
            `Delete task "${task.title}"?`
        );
        if (!confirmed) return;

        dispatch(removeTask(task._id));
    };

    return (
        <li
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: "#fff",
                opacity: task.status === "done" ? 0.6 : 1,
            }}
        >
            {/* Title */}
            <span
                style={{
                    textDecoration: task.status === "done" ? "line-through" : "none",
                    flex: 1,
                }}
            >
                {task.title}
            </span>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
                {task.status !== "done" && (
                    <button
                        onClick={handleMarkDone}
                        disabled={isToggling}
                        style={{
                            opacity: isToggling ? 0.6 : 1,
                        }}
                    >
                        {isToggling ? "Marking..." : "Done"}
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                        color: "#b91c1c",
                        opacity: isDeleting ? 0.6 : 1,
                    }}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </li>
    );

}
