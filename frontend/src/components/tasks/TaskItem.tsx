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
            className={`flex items-center justify-between rounded-lg border border-slate-700 bg-surface px-4 py-3 ${task.status === "done" ? "opacity-60" : ""
                }`}
        >
            <span
                className={`text-sm flex-1 ${task.status === "done" ? "line-through text-muted" : ""
                    }`}
            >
                {task.title}
            </span>

            <div className="flex gap-2">
                {task.status !== "done" && (
                    <button
                        onClick={handleMarkDone}
                        disabled={isToggling}
                        className="text-sm text-primary hover:underline disabled:opacity-50"
                    >
                        {isToggling ? "Marking…" : "Done"}
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-sm text-red-400 hover:underline disabled:opacity-50"
                >
                    {isDeleting ? "Deleting…" : "Delete"}
                </button>
            </div>
        </li>
    );
}
