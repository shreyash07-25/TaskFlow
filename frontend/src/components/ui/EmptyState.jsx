import { ClipboardIcon } from "./Icon";

function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <ClipboardIcon width={28} height={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
