import TaskFilter from "@/components/TaskFilter";
import TaskCard from "@/components/TaskCard";
import TaskListClientWrapper from "@/components/TaskListClientWrapper";
import { fetchTasks } from "./actions/taskActions";
import { Category, TaskData } from "./types";
import { fetchCategories } from "./actions/categoryActions";

const Tasks = async ({
  searchParams,
}: {
  searchParams: {
    dueDate: string;
    priority: string;
    status: string;
    categoryId: string;
    skip?: string;
  };
}) => {
  const dueDate = searchParams.dueDate;
  const priority = searchParams.priority;
  const status = searchParams.status;
  const categoryId = searchParams.categoryId;
  const skip = searchParams.skip ? parseInt(searchParams.skip, 10) : 0;

  const { data, total, error } = await fetchTasks({
    dueDate,
    priority,
    status,
    categoryId,
    skip,
    take: 10,
  });

  const { categories, category_error  } = await fetchCategories();
  let userCategories = categories;
  if (category_error) {
    console.error(category_error);
    userCategories = [];
  }


  return (
    <div className="md:pl-64 pt-[72px] md:pt-0">
      <div className="max-w-7xl mx-auto">
        <TaskFilter userCategories={userCategories as Category[]} />
      </div>
      <div className="bg-white rounded-lg shadow p-6 mx-4 md:mx-0">
        <TaskListClientWrapper
          tasks={data as TaskData[]}
          total={total as number}
          error={error as string}
          userCategories={userCategories as Category[]}
        >
          {data &&
            (data as TaskData[]).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </TaskListClientWrapper>
      </div>
    </div>
  );
};

export default Tasks;
