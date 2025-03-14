"use client";

import AddCategoryDialog from "@/components/AddCategoryDialog";

export default function CategoriesPage() {
  return (
    <div className="md:pl-64 pt-[72px] md:pt-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-end px-4 md:px-0">
          <AddCategoryDialog />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mx-4 md:mx-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
        </div>
      </div>
    </div>
  );
}
