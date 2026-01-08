// Page wrapper (server component for build compatibility)
import CategoryPageClient from "./_components/category-page-client";

export default function CategoryPage() {
  return <CategoryPageClient />;
}

// Required for output: 'export'
// Generate all category pages at build time
export async function generateStaticParams() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch categories for generateStaticParams');
      return [];
    }
    
    const categories = await response.json();
    console.log(`Generating ${categories.length} category pages...`);
    
    return categories.map((cat: any) => ({
      category: cat.category || cat.name || cat.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Allow params not in generateStaticParams (for dev mode)
export const dynamicParams = true;
