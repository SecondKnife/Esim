import Navbar from "../_components/Navbar";
import Sidebar from "../_components/Sidebar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/get-current-user";

export const metadata = {
  title: "Admin | eSIM Store",
  description: `Admin panel for eSIM Store management`,
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-14 flex h-full gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <Sidebar />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
