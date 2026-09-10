import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { PlusIcon } from "./ui/Icon";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) {
      nextErrors.title = "Give the task a title.";
    } else if (title.trim().length > 120) {
      nextErrors.title = "Keep the title under 120 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setErrors({});
        onTaskCreated();
      } else {
        setFormError(data.message || "Could not create the task. Try again.");
      }
    } catch (err) {
      console.error("Create task request failed:", err);
      setFormError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="task-form">
      <h2>Add a task</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="task-form__row">
          <Input
            label="Title"
            placeholder="What needs to get done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={PRIORITY_OPTIONS}
          />
        </div>

        <Input
          label="Description"
          placeholder="Add a little more detail (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {formError && <p className="field__message field__message--error">{formError}</p>}

        <div className="task-form__actions">
          <Button
            type="submit"
            loading={isSubmitting}
            icon={<PlusIcon width={16} height={16} />}
          >
            Add task
          </Button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
