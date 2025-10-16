"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  Loader2,
  Heart,
} from "lucide-react";
import { Button } from "@/components";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components";
import { cn } from "@/lib/utils";
import React, { useContext, useState } from "react";
import { cartContext } from "@/context/cartContext";
import { wishlistContext } from "@/context/wishlistContext";
import { UserDropdown } from "./UserDropdown";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { cartCount, isCartLoading } = useContext(cartContext);
  const { wishlistItems, isWishlistLoading } = useContext(wishlistContext);

  const isAuthenticated = !!session;
  const isLoading = status === "loading";

  const navItems = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ];

  const handleSignIn = () => {
    router.replace("/auth/login");
  };

  const handleSignUp = () => {
    router.replace("/auth/register");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                C
              </span>
            </div>
            <span className="font-bold text-xl">Clickora</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((navItem) => {
                const isActive = pathname.startsWith(navItem.href);
                return (
                  <NavigationMenuItem key={navItem.href}>
                    <Link href={navItem.href}>
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md font-semibold"
                            : "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        {navItem.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">

            <Link href={"/wishlist"}>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute p-1 -top-1 -right-1 aspect-square w-fit rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {isWishlistLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : wishlistItems.length > 99 ? (
                    "99+"
                  ) : (
                    wishlistItems.length
                  )}
                </span>
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link href={"/cart"}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute p-1 -top-1 -right-1 aspect-square w-fit rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {isCartLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : cartCount! > 99 ? (
                    "99+"
                  ) : (
                    cartCount
                  )}
                </span>
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>


            {/* User Account Dropdown */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <UserDropdown onLogout={() => signOut()} />
            ) : (
              <>
                {pathname.startsWith("/auth/login") ? (
                  <Button onClick={handleSignUp}>
                    Sign up
                  </Button>
                ) : pathname.startsWith("/auth/register") ? (
                  <Button onClick={handleSignIn}>
                    Sign in
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleSignIn}>
                      Sign in
                    </Button>
                    <Button onClick={handleSignUp}>
                      Sign up
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute start-0 end-0 border-t bg-background">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((navItem) => {
                  const isActive = pathname.startsWith(navItem.href);

                  return (
                    <Link
                      key={navItem.href}
                      href={navItem.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {navItem.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
