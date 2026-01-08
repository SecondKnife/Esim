"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="pt-5 mt-2 w-full max-w-4xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="pt-5 mt-2 w-full max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Shield className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.role === "ADMIN" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Password & Security</h2>
          <p className="text-gray-600">
            Password management and security settings coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
