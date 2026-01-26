import TitleHeader from "@/app/(admin)/_components/title-header";
import EditProduct from "../_components/edit-product";

// Static edit page (static export friendly)
// Uses query param: /admin/products/edit?productId=...
export default function EditProductPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit product" description="Edit a product" />
      <EditProduct />
    </div>
  );
}


