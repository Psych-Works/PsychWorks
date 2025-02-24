"use client"

import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import React from "react"

interface SearchBarProps {
    value: string
    onChange: (val: string) => void
    placeholder?: string
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search Table..."
}: SearchBarProps) {
    return (
        <div className="flex gap-3 w-full px-3 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200">
            <MagnifyingGlassIcon className="h-4 w-4 text-black my-auto" />
            <Input
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-12 w-full border-0 outline-none bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    )
} 
