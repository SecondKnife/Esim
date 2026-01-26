"use client";

import Link from "next/link";
import { AlertCircle, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function UnauthorizedPage() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          You don&apos;t have permission to access this page
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-red-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Required Role:</strong> Admin or Moderator
          </p>
          {user ? (
            <>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Your Role:</strong> {user.role}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-700">
              You are not logged in
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          
          {!user && (
            <Link href="/login">
              <Button className="w-full sm:w-auto">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please contact the administrator.
        </p>
      </div>
    </div>
  );
}
