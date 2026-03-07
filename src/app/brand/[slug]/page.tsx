"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Smartphone, AlertCircle, Filter, X } from "lucide-react"

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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { DeviceCard, DeviceCardSkeleton, type Device } from "@/components/device-card"

interface BrandData {
  id: string
  name: string
  slug: string
  logo?: string | null
  description?: string | null
  devices: Device[]
}

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

// Get unique years from devices
function getUniqueYears(devices: Device[]): number[] {
  const years = devices
    .map((d) => d.releaseYear)
    .filter((year): year is number => year !== null && year !== undefined)
  return [...new Set(years)].sort((a, b) => b - a)
}

// Filter component for desktop sidebar
function FilterSidebar({
  years,
  selectedYear,
  onYearChange,
  deviceCount,
  filteredCount,
}: {
  years: number[]
  selectedYear: string | null
  onYearChange: (year: string | null) => void
  deviceCount: number
  filteredCount: number
}) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filters</h3>
            {selectedYear && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onYearChange(null)}
              >
                Clear
              </Button>
            )}
          </div>

          <Separator />

          {/* Release Year Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Release Year</label>
            <Select
              value={selectedYear || "all"}
              onValueChange={(value) => onYearChange(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredCount} of {deviceCount} devices
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mobile filter drawer
function MobileFilterDrawer({
  years,
  selectedYear,
  onYearChange,
  deviceCount,
  filteredCount,
}: {
  years: number[]
  selectedYear: string | null
  onYearChange: (year: string | null) => void
  deviceCount: number
  filteredCount: number
}) {
  const [open, setOpen] = React.useState(false)

  const handleYearChange = (value: string) => {
    onYearChange(value === "all" ? null : value)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {selectedYear && (
            <Badge variant="secondary" className="ml-1">
              1
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Filter devices by release year
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-8">
          <div className="flex flex-col gap-4">
            {/* Active Filters */}
            {selectedYear && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active:</span>
                <Badge variant="secondary" className="gap-1">
                  {selectedYear}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => onYearChange(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}

            {/* Release Year */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Release Year</label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={!selectedYear ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleYearChange("all")}
                >
                  All
                </Button>
                {years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year.toString() ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleYearChange(year.toString())}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Results */}
            <div className="text-sm text-muted-foreground text-center">
              Showing {filteredCount} of {deviceCount} devices
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

// Loading skeleton for the page
function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex gap-6">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-64 shrink-0">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <DeviceCardSkeleton key={i} />
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
          <h2 className="text-lg font-semibold mb-2">Error Loading Brand</h2>
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
function EmptyState({ brandName }: { brandName: string }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">No Devices Found</h2>
        <p className="text-muted-foreground mb-4">
          {brandName} doesn&apos;t have any devices available yet.
        </p>
        <Button asChild>
          <Link href="/">Browse Other Brands</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function BrandPage() {
  const params = useParams()
  const slug = params.slug as string
  const isMobile = useIsMobile()

  const [brand, setBrand] = React.useState<BrandData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedYear, setSelectedYear] = React.useState<string | null>(null)

  // Fetch brand data
  const fetchBrand = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/brands/${slug}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to load brand")
      }

      setBrand(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [slug])

  React.useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

  // Get unique years for filtering
  const years = brand ? getUniqueYears(brand.devices) : []

  // Filter devices by year
  const filteredDevices = React.useMemo(() => {
    if (!brand) return []
    if (!selectedYear) return brand.devices

    return brand.devices.filter(
      (device) => device.releaseYear?.toString() === selectedYear
    )
  }, [brand, selectedYear])

  // Loading state
  if (loading) {
    return <PageSkeleton />
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={fetchBrand} />
  }

  // No brand found
  if (!brand) {
    return <ErrorState message="Brand not found" />
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
            <BreadcrumbPage>{brand.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Brand Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {/* Brand Logo */}
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-secondary">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-12 h-12 object-contain"
              />
            ) : (
              <Smartphone className="w-8 h-8 text-muted-foreground" />
            )}
          </div>

          {/* Brand Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{brand.name}</h1>
            {brand.description && (
              <p className="text-muted-foreground mt-1">{brand.description}</p>
            )}
          </div>
        </div>

        {/* Device Count Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {brand.devices.length} {brand.devices.length === 1 ? "device" : "devices"}
          </Badge>
        </div>
      </div>

      {/* Empty State */}
      {brand.devices.length === 0 ? (
        <EmptyState brandName={brand.name} />
      ) : (
        <div className="flex gap-6">
          {/* Desktop Sidebar Filter */}
          {!isMobile && (
            <div className="w-64 shrink-0">
              <FilterSidebar
                years={years}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                deviceCount={brand.devices.length}
                filteredCount={filteredDevices.length}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort Bar */}
            {isMobile && (
              <div className="flex items-center justify-between mb-4">
                <MobileFilterDrawer
                  years={years}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  deviceCount={brand.devices.length}
                  filteredCount={filteredDevices.length}
                />
                <span className="text-sm text-muted-foreground">
                  {filteredDevices.length} devices
                </span>
              </div>
            )}

            {/* Device Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDevices.map((device) => (
                <Link key={device.id} href={`/device/${device.slug}`}>
                  <DeviceCard device={device} />
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredDevices.length === 0 && selectedYear && (
              <Card className="max-w-md mx-auto mt-8">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No devices found for year {selectedYear}
                  </p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setSelectedYear(null)}
                  >
                    Clear filter
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
