"use server";

import CategoryService from "@/services/categoryService";
import { revalidatePath } from "next/cache";

export async function fetchCategories() {
  try {
    const user = await CategoryService.getCurrUser();

    const categories = await CategoryService.getCategoriesByUserId(user.id);
    return {
      category_error: null,
      categories: categories,
    };
  } catch (error) {
    console.error(error);
    return {
      category_error: "Error fetching categories",
      categories: null,
    };
  }
}

export async function addCategory(name: string) {
  try {
    const user = await CategoryService.getCurrUser();

    await CategoryService.createCategory(user.id, name);

    revalidatePath("/categories");

    return {
      category_error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      category_error: "Error adding category",
    };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    await CategoryService.updateCategory(id, name);
    revalidatePath("/categories");
    return {
      category_error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      category_error: "Error updating category",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await CategoryService.deleteCategory(id);
    revalidatePath("/categories");
    revalidatePath("/");
    return {
      category_error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      category_error: "Error deleting category",
    };
  }
}
