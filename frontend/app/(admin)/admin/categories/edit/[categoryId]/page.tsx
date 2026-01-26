import React from "react";
import NewCategorie from "../../_components/new-categorie";
import TitleHeader from "@/app/(admin)/_components/title-header";

export async function generateStaticParams(): Promise<Array<{ categoryId: string }>> {
  return [];
}

// Force static generation for export builds
export const dynamic = "force-static";
export const dynamicParams = false;

export default function EditCategoryPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit category" description="Edit a category" />
      <NewCategorie />
    </div>
  );
}
