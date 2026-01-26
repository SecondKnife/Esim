import TitleHeader from "@/app/(admin)/_components/title-header";
import React from "react";
import NewUser from "../../_components/new-user";

export async function generateStaticParams(): Promise<Array<{ userId: string }>> {
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
