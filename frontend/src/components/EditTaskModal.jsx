import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Button from "./ui/Button";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function EditTaskModal({ task, isOpen, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setError("");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Give the task a title.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(task._id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      onClose();
    } catch (err) {
      console.error("Update task failed:", err);
      setError("Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Edit task" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
        />

        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={PRIORITY_OPTIONS}
        />

        <div className="modal__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSaving}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditTaskModal;
