import TaskFilter from "@/components/TaskFilter";
import TaskCard from "@/components/TaskCard";
import TaskCardClientWrapper from "@/components/TaskCardClientWrapper";

const dummyTasks = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Draft and finalize the Q2 project proposal for client review",
    priority: "HIGH",
    status: "IN_PROGRESS",
    dueDate: "2024-04-25",
    categories: ["Work", "Project"],
  },
  {
    id: 2,
    title: "Weekly Team Meeting",
    description: "Prepare agenda and host weekly team sync-up",
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: "2024-04-22",
    categories: ["Work"],
  },
  {
    id: 3,
    title: "Gym Session",
    description: "30 minutes cardio and strength training",
    priority: "LOW",
    status: "PENDING",
    dueDate: "2024-04-21",
    categories: ["Personal"],
  },
  {
    id: 4,
    title: "Code Review",
    description: "Review pull requests for the authentication feature",
    priority: "HIGH",
    status: "COMPLETED",
    dueDate: "2024-04-20",
    categories: ["Work", "Project"],
  },
  {
    id: 5,
    title: "Birthday Shopping",
    description: "Buy birthday gift for Mom",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    dueDate: "2024-04-23",
    categories: ["Personal"],
  },
  {
    id: 6,
    title: "Database Migration",
    description: "Implement and test new database schema migration",
    priority: "HIGH",
    status: "PENDING",
    dueDate: "2024-04-24",
    categories: ["Work", "Project"],
  },
];

const Tasks = () => {
  return (
    <div className="md:pl-64 pt-[72px] md:pt-0">
      <div className="max-w-7xl mx-auto">
        <TaskFilter />
      </div>
      <div className="bg-white rounded-lg shadow p-6 mx-4 md:mx-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTasks.map((task) => (
            <TaskCardClientWrapper key={task.id}>
              <TaskCard
                title={task.title}
                description={task.description}
                priority={task.priority}
                status={task.status}
                dueDate={task.dueDate}
                categories={task.categories}
              />
            </TaskCardClientWrapper>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
