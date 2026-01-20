import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addTask } from "../../store/tasks/tasksSlice";
import CreateTaskForm from "../../components/tasks/CreateTaskForm";

export default function NewTaskPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const createStatus = useAppSelector(
        state => state.tasks.mutations.create.status
    );

    const handleCreateTask = async (title: string) => {
        const result = await dispatch(addTask(title));

        if (addTask.fulfilled.match(result)) {
            navigate("/tasks");
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">New Task</h1>
                <p className="text-sm text-muted mt-1">
                    Add a new task to your list
                </p>
            </div>

            <CreateTaskForm
                onSubmit={handleCreateTask}
                isSubmitting={createStatus === "loading"}
            />
        </div>
    );
}
