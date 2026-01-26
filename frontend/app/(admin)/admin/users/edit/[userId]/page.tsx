import TitleHeader from "@/app/(admin)/_components/title-header";
import React from "react";
import NewUser from "../../_components/new-user";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function EditPageUser() {
  return (
    <div className="p-4 mt-2 w-3/4 max-md:w-full mx-auto">
      <TitleHeader title="Edit user" description="Edit a user role" />
      <NewUser />
    </div>
  );
}
