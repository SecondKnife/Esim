import TitleHeader from "@/app/(admin)/_components/title-header";
import EditProduct from "../_components/edit-product";

export function generateStaticParams() {
  return [];
}

// Force static generation for export builds
export const dynamic = "force-static";
export const dynamicParams = false;

export default function EditPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit product" description="Edit a product" />
      <EditProduct />
    </div>
  );
}
