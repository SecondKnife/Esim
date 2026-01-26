import React from "react";
import NewCategorie from "../../_components/new-categorie";
import TitleHeader from "@/app/(admin)/_components/title-header";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function EditCategoryPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit category" description="Edit a category" />
      <NewCategorie />
    </div>
  );
}
