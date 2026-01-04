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
        <div>
            <h1>New Task</h1>
            <CreateTaskForm
                onSubmit={handleCreateTask}
                isSubmitting={createStatus === "loading"}
            />
        </div>
    );
}
