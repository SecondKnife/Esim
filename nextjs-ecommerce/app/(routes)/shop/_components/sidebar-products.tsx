import { getAllProducts, getCategories } from "@/lib/apiCalls";
import SidebarItems from "./sidebar-items";
import PriceInput from "./price-input";

interface SidebarProductsProps {
  products?: any[]; // Optional products from parent page
}

const SidebarProducts = async ({ products }: SidebarProductsProps = {}) => {
  const category = await getCategories();
  
  // Use products from props if available, otherwise fetch all products
  // This avoids duplicate API calls when products are already fetched in parent page
  let data = products;
  if (!data || data.length === 0) {
    data = await getAllProducts();
  }

  return (
    <div className="w-1/6 max-sm:w-full p-4 flex flex-col gap-y-1">
      <p className="font-semibold mt-1 text-foreground">Danh mục</p>
      <SidebarItems category={category} />
      <PriceInput data={data || []} />
    </div>
  );
};

export default SidebarProducts;
