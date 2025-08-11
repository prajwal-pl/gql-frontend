"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { ME } from "@/lib/gql";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, UserRound, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading } = useQuery(ME);
  const router = useRouter();
  const pathname = usePathname();
  const name = data?.me?.name;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  };

  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
  }) => {
    const isActive = pathname === href;

    return (
      <Link href={href} className="block">
        <motion.div
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Icon size={18} />
          <span>{label}</span>
          {isActive && (
            <motion.div
              className="absolute left-0 w-1 h-8 bg-primary-foreground rounded-r-full"
              layoutId="activeNavIndicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <div>
      <header className="border-b sticky top-0 z-40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <motion.div
          className="container mx-auto px-6 h-16 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <motion.div
                className="font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                GQL Dashboard
              </motion.div>
            </Link>
            <nav className="hidden md:flex items-center gap-4 ml-6">
              <NavLink
                href="/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />
              <NavLink href="/profile" label="Profile" icon={UserRound} />
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {loading || !mounted ? (
              <>
                <Skeleton className="w-32 h-8 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
              </>
            ) : (
              <>
                <span className="text-sm font-medium hidden sm:block">
                  {name && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {name}
                    </motion.span>
                  )}
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="bg-gradient-to-br from-purple-600 to-cyan-500 text-white">
                    <AvatarFallback>
                      {name ? getInitials(name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden md:flex gap-1 items-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </motion.div>
                <Sheet>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="outline" size="icon">
                      <Menu size={18} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center py-4">
                        <h2 className="font-semibold text-lg">Menu</h2>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <X size={18} />
                          </Button>
                        </SheetTrigger>
                      </div>
                      <Separator />
                      <div className="flex flex-col gap-2 mt-6">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          <LayoutDashboard size={18} />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          <UserRound size={18} />
                          <span>Profile</span>
                        </Link>
                      </div>
                      <div className="mt-auto py-4">
                        <Button
                          className="w-full flex items-center gap-2"
                          variant="destructive"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </motion.div>
      </header>
      <main>{children}</main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
