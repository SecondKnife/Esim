import TitleHeader from "@/app/(admin)/_components/title-header";
import NewUser from "../_components/new-user";

// Static edit page (static export friendly)
// Uses query param: /admin/users/edit?userId=...
export default function EditUserPage() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit user" description="Edit a user role" />
      <NewUser />
    </div>
  );
}


