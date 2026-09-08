import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

   const response = await fetch("https://taskflow-rijw.onrender.com/api/tasks/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

   const response = await fetch(
  `https://taskflow-rijw.onrender.com/api/tasks/${taskId}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    if (response.ok) {
      fetchTasks();
    }
  };

  const editTask = async (task) => {
    const newTitle = prompt("Enter new title:", task.title);

    if (!newTitle) {
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
  `https://taskflow-rijw.onrender.com/api/tasks/${task._id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: newTitle,
    }),
  }
);

    if (response.ok) {
      fetchTasks();
    }
  };

  const toggleStatus = async (task) => {
    const token = localStorage.getItem("token");

    const newStatus =
      task.status === "pending" ? "completed" : "pending";

    const response = await fetch(
      `https://taskflow-rijw.onrender.com/api/tasks/${task._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    if (response.ok) {
      fetchTasks();
    }
  };

  return (
    <div className="container">
      <Navbar />

      <h2>Task Dashboard</h2>

      <TaskForm onTaskCreated={fetchTasks} />

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>
  Priority:{" "}
  <span className={`priority ${task.priority}`}>
    {task.priority}
  </span>
</p>


            <p>
  Status:{" "}
  <span className={`status ${task.status}`}>
    {task.status}
  </span>
</p>
            <button onClick={() => toggleStatus(task)}>
              {task.status === "pending"
                ? "Mark Completed"
                : "Mark Pending"}
            </button>

            <div className="task-actions">
              <button onClick={() => editTask(task)}>
                Edit
              </button>

              <button
                className="delete-button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;