// Page wrapper (server component for build compatibility)
import CategoryPageClient from "./_components/category-page-client";

export default function CategoryPage() {
  return <CategoryPageClient />;
}

// Required for output: 'export'
// For static export, we return empty array and let client-side handle routing
export async function generateStaticParams() {
  // In static export mode, we can't fetch from API at build time
  // Return empty array and let client-side routing handle it
  return [];
}

// Allow params not in generateStaticParams (for dev mode)
export const dynamicParams = true;
