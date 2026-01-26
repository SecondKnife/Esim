import TitleHeader from "@/app/(admin)/_components/title-header";
import NewCategorie from "../_components/new-categorie";

// Static edit page (static export friendly)
// Uses query param: /admin/categories/edit?categoryId=...
export default function EditCategoryPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit category" description="Edit a category" />
      <NewCategorie />
    </div>
  );
}


