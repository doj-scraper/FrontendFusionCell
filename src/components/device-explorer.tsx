"use client"

import * as React from "react"
import { ChevronLeft, Package, AlertCircle, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  BrandCard,
  BrandCardSkeleton,
  type Brand,
} from "@/components/brand-card"
import {
  DeviceCard,
  DeviceCardSkeleton,
  type Device,
} from "@/components/device-card"
import {
  PartCard,
  PartCardSkeleton,
  type Part,
} from "@/components/part-card"

// API response types
interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// View state type
type ViewLevel = "brands" | "devices" | "parts"

// State types
interface BrandsState {
  brands: Brand[]
  loading: boolean
  error: string | null
}

interface DevicesState {
  brand: Brand | null
  devices: Device[]
  loading: boolean
  error: string | null
}

interface PartsState {
  device: Device & { brand: { id: string; name: string; slug: string; logo?: string | null } }
  parts: Part[]
  loading: boolean
  error: string | null
}

// Empty state component
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <Icon className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm text-center mb-4">
          {description}
        </p>
        {action && actionLabel && (
          <Button onClick={action} variant="outline">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Error state component
function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading data.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-12 h-12 text-destructive/50 mb-4" />
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm text-center mb-4">
          {description}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Loading skeleton for brands
function BrandsLoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <BrandCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Loading skeleton for devices
function DevicesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <DeviceCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Loading skeleton for parts
function PartsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <PartCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Brand sidebar item for desktop
function BrandSidebarItem({
  brand,
  isSelected,
  onClick,
}: {
  brand: Brand
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-accent"
      )}
      aria-label={`Select ${brand.name}`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded bg-secondary shrink-0">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt=""
            className="w-5 h-5 object-contain"
          />
        ) : (
          <Package className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <span className="truncate">{brand.name}</span>
      <Badge variant="secondary" className="ml-auto text-xs">
        {brand.deviceCount}
      </Badge>
    </button>
  )
}

export function DeviceExplorer() {
  const isMobile = useIsMobile()
  
  // State
  const [viewLevel, setViewLevel] = React.useState<ViewLevel>("brands")
  const [brandsState, setBrandsState] = React.useState<BrandsState>({
    brands: [],
    loading: true,
    error: null,
  })
  const [devicesState, setDevicesState] = React.useState<DevicesState>({
    brand: null,
    devices: [],
    loading: false,
    error: null,
  })
  const [partsState, setPartsState] = React.useState<PartsState | null>(null)
  
  // Mobile accordion state
  const [mobileAccordionValue, setMobileAccordionValue] = React.useState<string[]>([])

  // Fetch brands on mount
  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsState((prev) => ({ ...prev, loading: true, error: null }))
        const response = await fetch("/api/brands")
        const result: ApiResponse<Brand[]> = await response.json()
        
        if (result.success) {
          setBrandsState({ brands: result.data, loading: false, error: null })
        } else {
          setBrandsState({ brands: [], loading: false, error: result.error || "Failed to load brands" })
        }
      } catch (error) {
        setBrandsState({ brands: [], loading: false, error: "Network error" })
      }
    }
    
    fetchBrands()
  }, [])

  // Fetch devices when brand is selected
  const fetchDevices = React.useCallback(async (brandSlug: string) => {
    try {
      setDevicesState((prev) => ({ ...prev, loading: true, error: null }))
      const response = await fetch(`/api/brands/${brandSlug}`)
      const result: ApiResponse<DevicesState["brand"] & { devices: Device[] }> = await response.json()
      
      if (result.success) {
        setDevicesState({
          brand: result.data,
          devices: result.data.devices,
          loading: false,
          error: null,
        })
        setViewLevel("devices")
      } else {
        setDevicesState((prev) => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to load devices",
        }))
      }
    } catch (error) {
      setDevicesState((prev) => ({
        ...prev,
        loading: false,
        error: "Network error",
      }))
    }
  }, [])

  // Fetch parts when device is selected
  const fetchParts = React.useCallback(async (deviceSlug: string) => {
    try {
      setPartsState({ device: null as any, parts: [], loading: true, error: null })
      const response = await fetch(`/api/devices/${deviceSlug}`)
      const result: ApiResponse<PartsState["device"] & { parts: Part[] }> = await response.json()
      
      if (result.success) {
        setPartsState({
          device: result.data,
          parts: result.data.parts,
          loading: false,
          error: null,
        })
        setViewLevel("parts")
      } else {
        setPartsState({
          device: null as any,
          parts: [],
          loading: false,
          error: result.error || "Failed to load parts",
        })
      }
    } catch (error) {
      setPartsState({
        device: null as any,
        parts: [],
        loading: false,
        error: "Network error",
      })
    }
  }, [])

  // Navigation handlers
  const handleBrandSelect = React.useCallback((brand: Brand) => {
    fetchDevices(brand.slug)
    if (isMobile) {
      setMobileAccordionValue(["devices"])
    }
  }, [fetchDevices, isMobile])

  const handleDeviceSelect = React.useCallback((device: Device) => {
    fetchParts(device.slug)
    if (isMobile) {
      setMobileAccordionValue(["parts"])
    }
  }, [fetchParts, isMobile])

  const handleBackToBrands = React.useCallback(() => {
    setViewLevel("brands")
    setDevicesState({ brand: null, devices: [], loading: false, error: null })
    setPartsState(null)
    if (isMobile) {
      setMobileAccordionValue([])
    }
  }, [isMobile])

  const handleBackToDevices = React.useCallback(() => {
    setViewLevel("devices")
    setPartsState(null)
    if (isMobile) {
      setMobileAccordionValue(["devices"])
    }
  }, [isMobile])

  // Placeholder handlers
  const handleAddToCart = React.useCallback((part: Part) => {
    console.log("Add to cart:", part.sku)
    // TODO: Implement cart functionality
  }, [])

  const handleQuickView = React.useCallback((part: Part) => {
    console.log("Quick view:", part.sku)
    // TODO: Implement quick view modal
  }, [])

  // Breadcrumb component
  const renderBreadcrumb = () => (
    <Breadcrumb>
      <BreadcrumbList>
        {viewLevel === "brands" ? (
          <BreadcrumbItem>
            <BreadcrumbPage>All Brands</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="cursor-pointer"
                onClick={handleBackToBrands}
              >
                <span>All Brands</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        
        {viewLevel === "devices" && devicesState.brand && (
          <BreadcrumbItem>
            <BreadcrumbPage>{devicesState.brand.name}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
        
        {viewLevel === "parts" && devicesState.brand && partsState?.device && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="cursor-pointer"
                onClick={handleBackToDevices}
              >
                <span>{devicesState.brand.name}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{partsState.device.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )

  // Mobile render with accordion
  if (isMobile) {
    return (
      <div className="space-y-4" role="region" aria-label="Device explorer">
        {renderBreadcrumb()}
        
        <Accordion
          type="multiple"
          value={mobileAccordionValue}
          onValueChange={setMobileAccordionValue}
          className="w-full"
        >
          {/* Brands Section */}
          <AccordionItem value="brands">
            <AccordionTrigger className="text-base font-semibold">
              Brands
            </AccordionTrigger>
            <AccordionContent>
              {brandsState.loading ? (
                <BrandsLoadingSkeleton />
              ) : brandsState.error ? (
                <ErrorState
                  description={brandsState.error}
                  onRetry={() => window.location.reload()}
                />
              ) : brandsState.brands.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No brands available"
                  description="Check back later for available brands."
                />
              ) : (
                <div className="space-y-3">
                  {brandsState.brands.map((brand) => (
                    <BrandCard
                      key={brand.id}
                      brand={brand}
                      onClick={() => handleBrandSelect(brand)}
                      isSelected={devicesState.brand?.id === brand.id}
                    />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Devices Section */}
          {(viewLevel === "devices" || viewLevel === "parts") && devicesState.brand && (
            <AccordionItem value="devices">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <span>{devicesState.brand.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {devicesState.devices.length} devices
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {devicesState.loading ? (
                  <DevicesLoadingSkeleton />
                ) : devicesState.error ? (
                  <ErrorState
                    description={devicesState.error}
                    onRetry={() => fetchDevices(devicesState.brand!.slug)}
                  />
                ) : devicesState.devices.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No devices available"
                    description="No devices found for this brand."
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {devicesState.devices.map((device) => (
                      <DeviceCard
                        key={device.id}
                        device={device}
                        onClick={() => handleDeviceSelect(device)}
                        isSelected={partsState?.device?.id === device.id}
                      />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Parts Section */}
          {viewLevel === "parts" && partsState?.device && (
            <AccordionItem value="parts">
              <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                  <span>{partsState.device.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {partsState.parts.length} parts
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {partsState.loading ? (
                  <PartsLoadingSkeleton />
                ) : partsState.error ? (
                  <ErrorState
                    description={partsState.error}
                    onRetry={() => fetchParts(partsState.device!.slug)}
                  />
                ) : partsState.parts.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No parts available"
                    description="No parts found for this device."
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {partsState.parts.map((part) => (
                      <PartCard
                        key={part.id}
                        part={part}
                        onAddToCart={handleAddToCart}
                        onQuickView={handleQuickView}
                      />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    )
  }

  // Desktop render with sidebar + main content
  return (
    <div className="flex gap-6" role="region" aria-label="Device explorer">
      {/* Sidebar - Brands List */}
      <aside className="w-64 shrink-0">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Brands</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="px-4 pb-4 space-y-1">
                {brandsState.loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 px-3 py-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                    ))}
                  </div>
                ) : brandsState.error ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                    <p className="mb-2">Failed to load brands</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  brandsState.brands.map((brand) => (
                    <BrandSidebarItem
                      key={brand.id}
                      brand={brand}
                      isSelected={devicesState.brand?.id === brand.id}
                      onClick={() => handleBrandSelect(brand)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {renderBreadcrumb()}
        
        <div className="mt-4">
          {/* Devices View */}
          {viewLevel === "devices" && devicesState.brand && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{devicesState.brand.name}</h2>
                  {devicesState.brand.description && (
                    <p className="text-sm text-muted-foreground">
                      {devicesState.brand.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">
                  {devicesState.devices.length} devices
                </Badge>
              </div>
              
              {devicesState.loading ? (
                <DevicesLoadingSkeleton />
              ) : devicesState.error ? (
                <ErrorState
                  description={devicesState.error}
                  onRetry={() => fetchDevices(devicesState.brand!.slug)}
                />
              ) : devicesState.devices.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No devices available"
                  description="No devices found for this brand."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {devicesState.devices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      onClick={() => handleDeviceSelect(device)}
                      isSelected={partsState?.device?.id === device.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Parts View */}
          {viewLevel === "parts" && partsState?.device && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToDevices}
                    aria-label="Back to devices"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <div>
                    <h2 className="text-xl font-semibold">{partsState.device.name}</h2>
                    {partsState.device.modelNumber && (
                      <p className="text-sm text-muted-foreground">
                        Model: {partsState.device.modelNumber}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">
                  {partsState.parts.length} parts
                </Badge>
              </div>
              
              {partsState.loading ? (
                <PartsLoadingSkeleton />
              ) : partsState.error ? (
                <ErrorState
                  description={partsState.error}
                  onRetry={() => fetchParts(partsState.device!.slug)}
                />
              ) : partsState.parts.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No parts available"
                  description="No parts found for this device."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partsState.parts.map((part) => (
                    <PartCard
                      key={part.id}
                      part={part}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Default: Select a brand */}
          {viewLevel === "brands" && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-1">Select a Brand</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a brand from the sidebar to view available devices
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default DeviceExplorer
