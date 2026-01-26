// Page wrapper (server component for build compatibility)
import CategoryPageClient from "./_components/category-page-client";

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  return [];
}

export const dynamicParams = true;

export default function CategoryPage() {
  return <CategoryPageClient />;
}
