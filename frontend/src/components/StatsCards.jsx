import { ClipboardIcon, ClockIcon, CheckCircleIcon, FlameIcon } from "./ui/Icon";

function StatsCards({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const highPriority = tasks.filter(
    (t) => t.priority === "high" && t.status !== "completed"
  ).length;

  const stats = [
    {
      label: "Total tasks",
      value: total,
      icon: <ClipboardIcon width={20} height={20} />,
      tone: "neutral",
    },
    {
      label: "Pending",
      value: pending,
      icon: <ClockIcon width={20} height={20} />,
      tone: "pending",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircleIcon width={20} height={20} />,
      tone: "completed",
    },
    {
      label: "High priority open",
      value: highPriority,
      icon: <FlameIcon width={20} height={20} />,
      tone: "high",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div className="stat-card" key={stat.label}>
          <div className={`stat-card__icon stat-card__icon--${stat.tone}`}>
            {stat.icon}
          </div>
          <div>
            <p className="stat-card__value">{stat.value}</p>
            <p className="stat-card__label">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
