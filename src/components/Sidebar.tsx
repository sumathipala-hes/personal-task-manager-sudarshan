"use client";

import { ListTodo, Tags, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/common-utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { name: "Tasks", href: "/", icon: ListTodo },
  { name: "Categories", href: "/categories", icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavigationLinks = () => (
    <nav className="flex-1 px-4 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "group flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-[#C7D9DD] text-gray-900"
                : "text-white hover:bg-[#C7D9DD] hover:text-gray-900"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Menu Button and Title */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#ADB2D4] p-4 flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#C7D9DD]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-[#ADB2D4]">
            <SheetHeader className="p-4">
              <SheetTitle className="text-2xl font-bold text-white">
                Task Mate
              </SheetTitle>
            </SheetHeader>
            <NavigationLinks />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-white ml-4">Task Mate</h1>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-[#ADB2D4]">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-white">Task Mate</h1>
          </div>
          <NavigationLinks />
        </div>
      </div>
    </>
  );
}
