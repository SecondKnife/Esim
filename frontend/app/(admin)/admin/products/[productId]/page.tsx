import TitleHeader from "@/app/(admin)/_components/title-header";
import EditProduct from "../_components/edit-product";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function EditPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit product" description="Edit a product" />
      <EditProduct />
    </div>
  );
}
