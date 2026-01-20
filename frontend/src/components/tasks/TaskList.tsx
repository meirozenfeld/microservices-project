import type { Task } from "../../store/tasks/tasks.types";
import TaskItem from "./TaskItem";

type Props = {
    tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
    return (
        <ul className="space-y-2">
            {tasks.map((task) => (
                <TaskItem key={task._id} task={task} />
            ))}
        </ul>
    );
}
