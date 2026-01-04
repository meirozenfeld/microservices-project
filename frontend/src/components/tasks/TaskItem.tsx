import type { Task } from "../../store/tasks/tasks.types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
    markTaskDone,
    removeTask,
} from "../../store/tasks/tasksSlice";

type Props = {
    task: Task;
};

export default function TaskItem({ task }: Props) {
    const dispatch = useAppDispatch();

    const handleMarkDone = () => {
        dispatch(markTaskDone(task._id));
    };

    const handleDelete = () => {
        dispatch(removeTask(task._id));
    };

    return (
        <li
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
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
                <button onClick={handleMarkDone}>
                    Done
                </button>
            )}

            <button onClick={handleDelete}>
                Delete
            </button>
        </li>
    );
}
