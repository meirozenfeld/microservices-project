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
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                disabled={isSubmitting}
                className="flex-1 rounded-md bg-background border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryHover disabled:opacity-50"
            >
                {isSubmitting ? "Creating…" : "Create"}
            </button>
        </form>
    );
}
