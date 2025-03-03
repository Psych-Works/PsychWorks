"use client"

import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

interface SearchBarProps {
    placeholder?: string
    onSearch: (query: string) => void
    debounceMs?: number
}

export function SearchBar({
    placeholder = "Search Table...",
    onSearch,
    debounceMs = 1000
}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchQuery)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [searchQuery, onSearch, debounceMs])

    return (
        <div className="flex gap-3 w-full px-3 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200">
            <MagnifyingGlassIcon className="h-4 w-4 text-black my-auto" />
            <Input
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full border-0 outline-none bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
        </div>
    )
} 
