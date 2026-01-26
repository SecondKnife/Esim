import AdminClientLayout from "./_components/admin-client-layout";

/**
 * Server layout for admin route tree.
 * Must remain a Server Component so Next.js can statically analyze dynamic routes
 * (generateStaticParams) when output: 'export' is enabled.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
