import { priorityEnum, statusEnum } from "@/validators/taskValidator";

export interface TaskData {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: priorityEnum;
  status: statusEnum;
  createdAt: Date;
  updatedAt: Date;
  categories: TaskCategory[];
}

interface TaskCategory {
  id: string;
  taskId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  priority: priorityEnum;
  status: statusEnum;
  categories: Category[];
}
    