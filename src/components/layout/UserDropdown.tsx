"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  onLogout: () => void;
}

export function UserDropdown({ onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const handleProfileClick = () => {
    router.push("/user");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5" />
        <span className="sr-only">User menu</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">User Account</p>
              <p className="text-xs text-muted-foreground">Manage your account</p>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 h-auto text-left"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Profile</div>
                <div className="text-xs text-muted-foreground">View and edit profile</div>
              </div>
            </Button>

            <Link href="/user?tab=orders">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-auto text-left"
                onClick={() => setIsOpen(false)}
              >
                <Package className="h-4 w-4 mr-3" />
                <div>
                  <div className="text-sm font-medium">My Orders</div>
                  <div className="text-xs text-muted-foreground">View order history</div>
                </div>
              </Button>
            </Link>


            <Link href="/user?tab=settings">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 h-auto text-left"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3" />
                <div>
                  <div className="text-sm font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">Account settings</div>
                </div>
              </Button>
            </Link>

            <div className="border-t border-border my-1"></div>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 h-auto text-left text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <div>
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-muted-foreground">Sign out of your account</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
