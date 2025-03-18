import AddCategoryDialog from "@/components/AddCategoryDialog";
import TaskCatogoryCard from "@/components/TaskCatogoryCard";

export default function CategoriesPage() {
  return (
    <div className="md:pl-64 pt-[72px] md:pt-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-end px-4 md:px-0">
          <AddCategoryDialog />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mx-4 md:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCategories.map((category) => (
              <TaskCatogoryCard key={category.id} id={category.id} name={category.name} createdAt={category.createdAt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockCategories = [
  {
    id: "67d0fa51047fb1dc4340c319",
    userId: "67d0fa3a047fb1dc4340c317",
    name: "category 5",
    createdAt: "2025-03-12T03:06:56.267Z",
    updatedAt: "2025-03-12T03:08:21.874Z",
  },
  {
    id: "67d0fa51047fb1dc4340c320",
    userId: "67d0fa3a047fb1dc4340c318",
    name: "category 6",
    createdAt: "2025-03-13T03:06:56.267Z",
    updatedAt: "2025-03-13T03:08:21.874Z",
  },
  {
    id: "67d0fa51047fb1dc4340c321",
    userId: "67d0fa3a047fb1dc4340c319",
    name: "category 7",
    createdAt: "2025-03-14T03:06:56.267Z",
    updatedAt: "2025-03-14T03:08:21.874Z",
  },
  {
    id: "67d0fa51047fb1dc4340c322",
    userId: "67d0fa3a047fb1dc4340c320",
    name: "category 8",
    createdAt: "2025-03-15T03:06:56.267Z",
    updatedAt: "2025-03-15T03:08:21.874Z",
  },
  {
    id: "67d0fa51047fb1dc4340c323",
    userId: "67d0fa3a047fb1dc4340c321",
    name: "category 9",
    createdAt: "2025-03-16T03:06:56.267Z",
    updatedAt: "2025-03-16T03:08:21.874Z",
  },
  {
    id: "67d0fa51047fb1dc4340c324",
    userId: "67d0fa3a047fb1dc4340c322",
    name: "category 10",
    createdAt: "2025-03-17T03:06:56.267Z",
    updatedAt: "2025-03-17T03:08:21.874Z",
  }
];