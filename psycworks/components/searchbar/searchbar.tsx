"use client"

import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onChange?: (value: string) => void
}

export function SearchBar({ placeholder = "Search...", className, onChange }: SearchBarProps) {
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="w-full">
        <NavigationMenuItem className="w-full">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-4 w-4 text-black z-10" />
            <Input
              type="search"
              placeholder={placeholder}
              className={`pl-12 h-12 w-full bg-gray-300 text-black placeholder:text-grey/70 border-none shadow-md
                focus:ring-2 focus:ring-black/20 ${className}`}
              onChange={(e) => onChange?.(e.target.value)}
            />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
} 