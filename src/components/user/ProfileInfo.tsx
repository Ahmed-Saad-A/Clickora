"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, Edit3 } from "lucide-react";
import { Button } from "@/components";
import { servicesApi } from "@/Services/api";
import { useSession } from "next-auth/react";

interface ProfileInfoProps {
  onEdit: () => void;
}

export function ProfileInfo({ onEdit }: ProfileInfoProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = session?.user;
  console.log("🚀 ~ ProfileInfo ~ user:", user)

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">No profile information available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Profile Information</h2>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="text-lg font-medium text-foreground">{user?.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="text-lg font-medium text-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone Number</p>
            <p className="text-lg font-medium text-foreground">{user?.phone || "Not provided"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="text-lg font-medium text-foreground capitalize">{user?.role || "User"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
