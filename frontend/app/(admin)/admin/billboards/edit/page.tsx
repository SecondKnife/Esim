import TitleHeader from "@/app/(admin)/_components/title-header";
import NewBillboard from "../_components/new-billboard";

// Static edit page (static export friendly)
// Uses query param: /admin/billboards/edit?id=...
export default function EditBillboardPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit billboard" description="Edit a billboard" />
      <NewBillboard />
    </div>
  );
}


