import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import StatsCards from "../components/StatsCards";
import EditTaskModal from "../components/EditTaskModal";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [busyTaskId, setBusyTaskId] = useState(null);

  const fetchTasks = async () => {
    setLoadError("");
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        setLoadError(data.message || "Could not load tasks.");
      }
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      setLoadError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    setBusyTaskId(taskId);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Delete task failed:", err);
    } finally {
      setBusyTaskId(null);
    }
  };

  const updateTask = async (taskId, updates) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      await fetchTasks();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Update failed");
    }
  };

  const toggleStatus = async (task) => {
    setBusyTaskId(task._id);
    const newStatus = task.status === "pending" ? "completed" : "pending";

    try {
      await updateTask(task._id, { status: newStatus });
    } catch (err) {
      console.error("Toggle status failed:", err);
    } finally {
      setBusyTaskId(null);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="container">
        <div className="page-header">
          <h2>Task dashboard</h2>
          <p className="page-header__subtitle">
            Track what's next, what's in progress, and what's done.
          </p>
        </div>

        <StatsCards tasks={tasks} />

        <TaskForm onTaskCreated={fetchTasks} />

        <section>
          <h2 className="section-title">Your tasks</h2>

          {isLoading ? (
            <div className="loading-state">
              <Spinner size={22} />
              <span>Loading tasks…</span>
            </div>
          ) : loadError ? (
            <p className="field__message field__message--error">{loadError}</p>
          ) : tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Add your first task above to start tracking your work."
            />
          ) : (
            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  busy={busyTaskId === task._id}
                  onToggleStatus={toggleStatus}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={updateTask}
      />
    </div>
  );
}

export default Dashboard;
