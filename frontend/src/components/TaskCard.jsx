import Badge from "./ui/Badge";
import Button from "./ui/Button";
import {
  CheckCircleIcon,
  CircleIcon,
  EditIcon,
  TrashIcon,
} from "./ui/Icon";

const PRIORITY_TONE = { low: "low", medium: "medium", high: "high" };
const STATUS_TONE = { pending: "pending", completed: "completed" };

function TaskCard({ task, onToggleStatus, onEdit, onDelete, busy }) {
  const isCompleted = task.status === "completed";

  return (
    <article className={`task-card ${isCompleted ? "task-card--done" : ""}`}>
      <div className="task-card__top">
        <h3 className="task-card__title">{task.title}</h3>
        <Badge tone={PRIORITY_TONE[task.priority] || "medium"}>
          {task.priority}
        </Badge>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__meta">
        <Badge tone={STATUS_TONE[task.status] || "pending"}>
          {task.status}
        </Badge>
      </div>

      <div className="task-card__actions">
        <button
          type="button"
          className="task-card__status-toggle"
          onClick={() => onToggleStatus(task)}
          disabled={busy}
        >
          {isCompleted ? (
            <CheckCircleIcon width={18} height={18} />
          ) : (
            <CircleIcon width={18} height={18} />
          )}
          {isCompleted ? "Completed" : "Mark complete"}
        </button>

        <div className="task-card__icon-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={<EditIcon width={16} height={16} />}
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={<TrashIcon width={16} height={16} />}
            onClick={() => onDelete(task._id)}
            aria-label="Delete task"
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
