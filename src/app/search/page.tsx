"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Search,
  Package,
  Smartphone,
  Building2,
  Filter,
  ArrowUpDown,
  Loader2,
  Sparkles,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PartCard, PartCardSkeleton } from "@/components/part-card"
import { DeviceCard, DeviceCardSkeleton } from "@/components/device-card"
import { BrandCard, BrandCardSkeleton } from "@/components/brand-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Types
interface SearchResultPart {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  image?: string | null
  quality?: string | null
  color?: string | null
  category?: {
    name: string
    slug: string
  } | null
  device?: {
    name: string
    slug: string
    brand: {
      name: string
      slug: string
    }
  } | null
  available: number
}

interface SearchResultDevice {
  id: string
  name: string
  slug: string
  modelNumber?: string | null
  image?: string | null
  releaseYear?: number | null
  brand: {
    name: string
    slug: string
    logo?: string | null
  }
  partCount: number
}

interface SearchResultBrand {
  id: string
  name: string
  slug: string
  logo?: string | null
  description?: string | null
  deviceCount: number
}

interface SearchResults {
  parts: SearchResultPart[]
  devices: SearchResultDevice[]
  brands: SearchResultBrand[]
}

interface SearchResponse {
  success: boolean
  data: SearchResults
  query: string
}

type FilterType = "all" | "parts" | "devices" | "brands"
type SortOption = "relevance" | "price_asc" | "price_desc" | "name_asc" | "name_desc"

const ITEMS_PER_PAGE = 12

// Filter button component
function FilterButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="gap-1.5"
    >
      {children}
      <Badge variant={active ? "secondary" : "outline"} className="ml-1 h-5 px-1.5">
        {count}
      </Badge>
    </Button>
  )
}

// Loading skeleton for the page
function PageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <PartCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// No results state
function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <div className="flex items-center justify-center mb-4">
        <Sparkles className="w-16 h-16 text-muted-foreground/30" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No results found</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't find any results for "{query}"
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <p className="text-sm text-muted-foreground w-full mb-2">Try searching for:</p>
        {["iPhone screen", "Samsung battery", "iPad", "Motorola"].map((term) => (
          <Button
            key={term}
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = `/search?q=${encodeURIComponent(term)}`)}
          >
            {term}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Result type badge
function ResultTypeBadge({ type }: { type: "part" | "device" | "brand" }) {
  const config = {
    part: { label: "Part", className: "bg-primary/10 text-primary border-primary/20" },
    device: { label: "Device", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
    brand: { label: "Brand", className: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400" },
  }

  const { label, className } = config[type]

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", className)}>
      {label}
    </Badge>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const typeParam = (searchParams.get("type") as FilterType) || "all"
  const sortParam = (searchParams.get("sort") as SortOption) || "relevance"
  const pageParam = parseInt(searchParams.get("page") || "1", 10)

  const [results, setResults] = React.useState<SearchResults | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [searchInput, setSearchInput] = React.useState(query)
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(typeParam)
  const [sortBy, setSortBy] = React.useState<SortOption>(sortParam)
  const [currentPage, setCurrentPage] = React.useState(pageParam)

  // Fetch search results
  React.useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim().length < 2) {
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${activeFilter}&limit=50`
        )
        const data: SearchResponse = await response.json()

        if (data.success) {
          setResults(data.data)
        } else {
          setResults({ parts: [], devices: [], brands: [] })
        }
      } catch (error) {
        console.error("Search error:", error)
        setResults({ parts: [], devices: [], brands: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, activeFilter])

  // Update URL params
  const updateParams = React.useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || value === "relevance" || value === 1) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      router.push(`/search?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Handle search input submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim().length >= 2) {
      updateParams({ q: searchInput.trim(), page: null })
    }
  }

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    setCurrentPage(1)
    updateParams({ type: filter === "all" ? null : filter, page: null })
  }

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    updateParams({ sort: sort === "relevance" ? null : sort })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateParams({ page: page === 1 ? null : page })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Calculate counts
  const counts = React.useMemo(() => {
    if (!results) return { all: 0, parts: 0, devices: 0, brands: 0 }
    return {
      all: results.parts.length + results.devices.length + results.brands.length,
      parts: results.parts.length,
      devices: results.devices.length,
      brands: results.brands.length,
    }
  }, [results])

  // Sort and paginate results
  const paginatedResults = React.useMemo(() => {
    if (!results) return { parts: [], devices: [], brands: [] }

    const sortArray = <T extends { name: string; price?: number }>(arr: T[]): T[] => {
      const sorted = [...arr]
      switch (sortBy) {
        case "name_asc":
          return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case "name_desc":
          return sorted.sort((a, b) => b.name.localeCompare(a.name))
        case "price_asc":
          return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
        case "price_desc":
          return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
        default:
          return sorted
      }
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE

    return {
      parts: sortArray(results.parts).slice(start, end),
      devices: results.devices.slice(start, end),
      brands: results.brands.slice(start, end),
    }
  }, [results, sortBy, currentPage])

  // Calculate total pages
  const totalPages = React.useMemo(() => {
    if (!results) return 1
    const totalItems = counts[activeFilter === "all" ? "all" : activeFilter]
    return Math.ceil(totalItems / ITEMS_PER_PAGE)
  }, [results, counts, activeFilter])

  if (loading && !results) {
    return <PageLoading />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for parts, devices, or brands..."
            className="pl-12 h-14 text-lg rounded-2xl border-2 focus-visible:ring-0 focus-visible:border-primary/50 shadow-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </form>
        {query && (
          <p className="mt-4 text-muted-foreground">
            Showing results for <span className="text-foreground font-medium">"{query}"</span>
          </p>
        )}
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton
            active={activeFilter === "all"}
            count={counts.all}
            onClick={() => handleFilterChange("all")}
          >
            All Results
          </FilterButton>
          <FilterButton
            active={activeFilter === "parts"}
            count={counts.parts}
            onClick={() => handleFilterChange("parts")}
          >
            <Package className="w-4 h-4" />
            Parts
          </FilterButton>
          <FilterButton
            active={activeFilter === "devices"}
            count={counts.devices}
            onClick={() => handleFilterChange("devices")}
          >
            <Smartphone className="w-4 h-4" />
            Devices
          </FilterButton>
          <FilterButton
            active={activeFilter === "brands"}
            count={counts.brands}
            onClick={() => handleFilterChange("brands")}
          >
            <Building2 className="w-4 h-4" />
            Brands
          </FilterButton>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => handleSortChange(v as SortOption)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name_asc">Name: A to Z</SelectItem>
              <SelectItem value="name_desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <PartCardSkeleton key={i} />
          ))}
        </div>
      ) : counts.all === 0 ? (
        <NoResults query={query} />
      ) : (
        <div className="space-y-12">
          {/* Mixed Results (All) */}
          {activeFilter === "all" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.brands.map((brand) => (
                <div key={brand.id} className="relative group">
                  <div className="absolute top-3 right-3 z-10">
                    <ResultTypeBadge type="brand" />
                  </div>
                  <BrandCard brand={brand} />
                </div>
              ))}
              {paginatedResults.devices.map((device) => (
                <div key={device.id} className="relative group">
                  <div className="absolute top-3 right-3 z-10">
                    <ResultTypeBadge type="device" />
                  </div>
                  <DeviceCard device={device} />
                </div>
              ))}
              {paginatedResults.parts.map((part) => (
                <div key={part.id} className="relative group">
                  <div className="absolute top-3 right-3 z-10">
                    <ResultTypeBadge type="part" />
                  </div>
                  <PartCard part={part} />
                </div>
              ))}
            </div>
          )}

          {/* Parts Only */}
          {activeFilter === "parts" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.parts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}

          {/* Devices Only */}
          {activeFilter === "devices" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.devices.map((device) => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          )}

          {/* Brands Only */}
          {activeFilter === "brands" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedResults.brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-8 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    // Logic for showing limited page numbers
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <React.Suspense fallback={<PageLoading />}>
      <SearchContent />
    </React.Suspense>
  )
}
