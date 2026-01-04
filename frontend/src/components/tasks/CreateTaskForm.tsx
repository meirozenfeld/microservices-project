import { useState } from "react";

type Props = {
    onSubmit: (title: string) => void;
    isSubmitting?: boolean;
};

export default function CreateTaskForm({
    onSubmit,
    isSubmitting = false,
}: Props) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSubmit(title);
        setTitle("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                disabled={isSubmitting}
            />

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
            </button>
        </form>
    );
}
