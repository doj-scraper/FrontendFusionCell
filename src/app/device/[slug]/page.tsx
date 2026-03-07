"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Smartphone, AlertCircle, Filter, X, ArrowUpDown, Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PartCard, PartCardSkeleton, type Part } from "@/components/part-card"

interface DeviceData {
  id: string
  name: string
  slug: string
  modelNumber?: string | null
  image?: string | null
  releaseYear?: number | null
  description?: string | null
  brand: {
    id: string
    name: string
    slug: string
    logo?: string | null
  }
  parts: Part[]
}

type SortOption = "default" | "price_asc" | "price_desc"

// Custom hook to check if mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

// Get unique categories from parts
function getUniqueCategories(parts: Part[]): { id: string; name: string; slug: string }[] {
  const categories = parts
    .map((p) => p.category)
    .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
  const uniqueMap = new Map(categories.map((c) => [c.id, c]))
  return Array.from(uniqueMap.values())
}

// Get unique qualities from parts
function getUniqueQualities(parts: Part[]): string[] {
  const qualities = parts
    .map((p) => p.quality)
    .filter((q): q is string => q !== null && q !== undefined)
  return [...new Set(qualities)].sort()
}

// Filter component for desktop sidebar
function FilterSidebar({
  categories,
  qualities,
  selectedCategory,
  selectedQuality,
  onCategoryChange,
  onQualityChange,
  partCount,
  filteredCount,
}: {
  categories: { id: string; name: string; slug: string }[]
  qualities: string[]
  selectedCategory: string | null
  selectedQuality: string | null
  onCategoryChange: (category: string | null) => void
  onQualityChange: (quality: string | null) => void
  partCount: number
  filteredCount: number
}) {
  const hasActiveFilters = selectedCategory || selectedQuality

  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onCategoryChange(null)
                  onQualityChange(null)
                }}
              >
                Clear all
              </Button>
            )}
          </div>

          <Separator />

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) => onCategoryChange(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quality Filter */}
          {qualities.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Quality</label>
              <Select
                value={selectedQuality || "all"}
                onValueChange={(value) => onQualityChange(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Qualities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Qualities</SelectItem>
                  {qualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {partCount} parts
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile filter drawer
function MobileFilterDrawer({
  categories,
  qualities,
  selectedCategory,
  selectedQuality,
  onCategoryChange,
  onQualityChange,
  partCount,
  filteredCount,
}: {
  categories: { id: string; name: string; slug: string }[]
  qualities: string[]
  selectedCategory: string | null
  selectedQuality: string | null
  onCategoryChange: (category: string | null) => void
  onQualityChange: (quality: string | null) => void
  partCount: number
  filteredCount: number
}) {
  const [open, setOpen] = React.useState(false)
  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedQuality ? 1 : 0)

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === "all" ? null : value)
  }

  const handleQualityChange = (value: string) => {
    onQualityChange(value === "all" ? null : value)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Filter parts by category and quality
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-8 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active:</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => onCategoryChange(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedQuality && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedQuality}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => onQualityChange(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs ml-auto"
                  onClick={() => {
                    onCategoryChange(null)
                    onQualityChange(null)
                  }}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Category */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quality */}
            {qualities.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Quality</label>
                <Select
                  value={selectedQuality || "all"}
                  onValueChange={handleQualityChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Qualities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Qualities</SelectItem>
                    {qualities.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            {/* Results */}
            <div className="text-sm text-muted-foreground text-center">
              Showing {filteredCount} of {partCount} parts
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Sort dropdown component
function SortSelect({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (value: SortOption) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger size="sm" className="w-[160px]">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Featured</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Loading skeleton for the page
function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 shrink-0">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PartCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Error state component
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Device</h2>
          <p className="text-muted-foreground mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry}>Try Again</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Empty state component
function EmptyState({ deviceName, brandSlug }: { deviceName: string; brandSlug: string }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">No Parts Available</h2>
        <p className="text-muted-foreground mb-4">
          {deviceName} doesn&apos;t have any parts available yet.
        </p>
        <Button asChild>
          <Link href={`/brand/${brandSlug}`}>Browse Other Devices</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function DevicePage() {
  const params = useParams()
  const slug = params.slug as string
  const isMobile = useIsMobile()

  const [device, setDevice] = React.useState<DeviceData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [selectedQuality, setSelectedQuality] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState<SortOption>("default")

  // Fetch device data
  const fetchDevice = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/devices/${slug}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to load device")
      }

      setDevice(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [slug])

  React.useEffect(() => {
    fetchDevice()
  }, [fetchDevice])

  // Get unique categories and qualities for filtering
  const categories = device ? getUniqueCategories(device.parts) : []
  const qualities = device ? getUniqueQualities(device.parts) : []

  // Filter and sort parts
  const filteredParts = React.useMemo(() => {
    if (!device) return []

    let parts = [...device.parts]

    // Filter by category
    if (selectedCategory) {
      parts = parts.filter((part) => part.category?.id === selectedCategory)
    }

    // Filter by quality
    if (selectedQuality) {
      parts = parts.filter((part) => part.quality === selectedQuality)
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        parts.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        parts.sort((a, b) => b.price - a.price)
        break
      case "default":
      default:
        // Default sorting: featured first, then by name
        parts.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return a.name.localeCompare(b.name)
        })
        break
    }

    return parts
  }, [device, selectedCategory, selectedQuality, sortBy])

  // Handle add to cart
  const handleAddToCart = React.useCallback((part: Part) => {
    // TODO: Implement cart functionality
    console.log("Add to cart:", part.sku)
  }, [])

  // Loading state
  if (loading) {
    return <PageSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchDevice} />
  }

  // No device found
  if (!device) {
    return <ErrorState message="Device not found" />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/brand/${device.brand.slug}`}>{device.brand.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{device.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Device Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Device Image */}
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-secondary">
            {device.image ? (
              <img
                src={device.image}
                alt={device.name}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <Smartphone className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Device Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{device.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              {device.modelNumber && (
                <span className="text-sm">Model: {device.modelNumber}</span>
              )}
              {device.releaseYear && (
                <>
                  <span className="text-muted-foreground/50">|</span>
                  <span className="text-sm">{device.releaseYear}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Parts Count Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {device.parts.length} {device.parts.length === 1 ? "part" : "parts"}
          </Badge>
        </div>
      </div>

      {/* Empty State */}
      {device.parts.length === 0 ? (
        <EmptyState deviceName={device.name} brandSlug={device.brand.slug} />
      ) : (
        <div className="flex gap-6">
          {/* Desktop Sidebar Filter */}
          {!isMobile && (
            <div className="w-64 shrink-0">
              <FilterSidebar
                categories={categories}
                qualities={qualities}
                selectedCategory={selectedCategory}
                selectedQuality={selectedQuality}
                onCategoryChange={setSelectedCategory}
                onQualityChange={setSelectedQuality}
                partCount={device.parts.length}
                filteredCount={filteredParts.length}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort Bar */}
            {isMobile && (
              <div className="flex items-center justify-between mb-4">
                <MobileFilterDrawer
                  categories={categories}
                  qualities={qualities}
                  selectedCategory={selectedCategory}
                  selectedQuality={selectedQuality}
                  onCategoryChange={setSelectedCategory}
                  onQualityChange={setSelectedQuality}
                  partCount={device.parts.length}
                  filteredCount={filteredParts.length}
                />
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
            )}

            {/* Desktop Sort */}
            {!isMobile && (
              <div className="flex items-center justify-end mb-4">
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
            )}

            {/* Parts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredParts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredParts.length === 0 && (selectedCategory || selectedQuality) && (
              <Card className="max-w-md mx-auto mt-8">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No parts match your filters
                  </p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => {
                      setSelectedCategory(null)
                      setSelectedQuality(null)
                    }}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
