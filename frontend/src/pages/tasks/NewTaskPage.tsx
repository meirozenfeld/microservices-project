import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addTask } from "../../store/tasks/tasksSlice";

export default function NewTaskPage() {
    const [title, setTitle] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const result = await dispatch(addTask(title));

        if (addTask.fulfilled.match(result)) {
            navigate("/tasks");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>New Task</h1>

            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
            />

            <button type="submit">Create</button>
        </form>
    );
}
