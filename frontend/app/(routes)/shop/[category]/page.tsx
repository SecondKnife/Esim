// Page wrapper (server component for build compatibility)
import CategoryPageClient from "./_components/category-page-client";

export async function generateStaticParams(): Promise<Array<{ category: string }>> {
  return [];
}

// Force static generation for export builds
export const dynamic = "force-static";
export const dynamicParams = false;

export default function CategoryPage() {
  return <CategoryPageClient />;
}
