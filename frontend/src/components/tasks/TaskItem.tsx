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
                gap: 8,
                opacity: task.status === "done" ? 0.6 : 1,
            }}
        >
            <span
                style={{
                    textDecoration:
                        task.status === "done" ? "line-through" : "none",
                }}
            >
                {task.title}
            </span>

            {task.status !== "done" && (
                <button
                    onClick={handleMarkDone}
                    disabled={isToggling}
                >
                    {isToggling ? "Marking..." : "Done"}
                </button>
            )}

            <button
                onClick={handleDelete}
                disabled={isDeleting}
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </li>
    );
}
