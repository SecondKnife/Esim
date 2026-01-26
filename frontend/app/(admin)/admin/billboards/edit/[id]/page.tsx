import TitleHeader from "@/app/(admin)/_components/title-header";
import NewBillboard from "../../_components/new-billboard";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function EditBillboardPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit billboard" description="Edit a billboard" />
      <NewBillboard />
    </div>
  );
}
