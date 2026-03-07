"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Package,
  Smartphone,
  Building2,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Types for search results
interface SearchResultPart {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  image?: string | null
  quality?: string | null
  device?: {
    name: string
    slug: string
    brand: {
      name: string
      slug: string
    }
  } | null
  category?: {
    name: string
    slug: string
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

interface SearchModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// Format price helper
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

// Loading skeleton for search results
function SearchLoading() {
  return (
    <div className="p-2">
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Part result item
function PartResultItem({ part, onSelect }: { part: SearchResultPart; onSelect: () => void }) {
  const discount = part.comparePrice
    ? Math.round(((part.comparePrice - part.price) / part.comparePrice) * 100)
    : null

  return (
    <CommandItem
      value={`part-${part.id}-${part.name}`}
      onSelect={onSelect}
      className="flex items-center gap-3 p-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
        {part.image ? (
          <img src={part.image} alt={part.name} className="w-full h-full object-contain" />
        ) : (
          <Package className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{part.sku}</span>
          {part.quality && (
            <Badge variant="outline" className="text-[10px] h-4 px-1">
              {part.quality}
            </Badge>
          )}
          {discount && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1">
              -{discount}%
            </Badge>
          )}
        </div>
        <p className="font-medium text-sm truncate">{part.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {part.device && (
            <span>
              {part.device.brand?.name} {part.device.name}
            </span>
          )}
          <span className="font-semibold text-primary">{formatPrice(part.price)}</span>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-aria-selected:opacity-100" />
    </CommandItem>
  )
}

// Device result item
function DeviceResultItem({ device, onSelect }: { device: SearchResultDevice; onSelect: () => void }) {
  return (
    <CommandItem
      value={`device-${device.id}-${device.name}`}
      onSelect={onSelect}
      className="flex items-center gap-3 p-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
        {device.image ? (
          <img src={device.image} alt={device.name} className="w-full h-full object-contain" />
        ) : (
          <Smartphone className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{device.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{device.brand?.name}</span>
          {device.modelNumber && (
            <>
              <span>·</span>
              <span className="font-mono">{device.modelNumber}</span>
            </>
          )}
          {device.releaseYear && (
            <>
              <span>·</span>
              <span>{device.releaseYear}</span>
            </>
          )}
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {device.partCount} parts
      </Badge>
    </CommandItem>
  )
}

// Brand result item
function BrandResultItem({ brand, onSelect }: { brand: SearchResultBrand; onSelect: () => void }) {
  return (
    <CommandItem
      value={`brand-${brand.id}-${brand.name}`}
      onSelect={onSelect}
      className="flex items-center gap-3 p-3"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-md bg-secondary/50 flex items-center justify-center overflow-hidden">
        {brand.logo ? (
          <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
        ) : (
          <Building2 className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{brand.name}</p>
        {brand.description && (
          <p className="text-xs text-muted-foreground truncate">{brand.description}</p>
        )}
      </div>
      <Badge variant="secondary" className="text-xs">
        {brand.deviceCount} devices
      </Badge>
    </CommandItem>
  )
}

// Empty state with suggestions
function EmptyState({ query, onSuggestionClick }: { query: string; onSuggestionClick: (term: string) => void }) {
  const suggestions = [
    { term: "iPhone 14", label: "Popular device" },
    { term: "Screen", label: "Common part" },
    { term: "Samsung", label: "Popular brand" },
    { term: "Battery", label: "Common part" },
  ]

  return (
    <div className="p-4 text-center">
      <div className="flex items-center justify-center mb-3">
        <Sparkles className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground mb-1">
        No results found for "{query}"
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Try searching for parts, devices, or brands
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.term}
            onClick={() => onSuggestionClick(suggestion.term)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Search className="w-3 h-3" />
            {suggestion.term}
            <span className="text-muted-foreground">· {suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Initial state with quick actions
function InitialState() {
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-muted-foreground mb-3">
        Start typing to search for parts, devices, or brands
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 rounded bg-muted border">↑↓</kbd>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 rounded bg-muted border">↵</kbd>
          <span>Select</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 rounded bg-muted border">esc</kbd>
          <span>Close</span>
        </div>
      </div>
    </div>
  )
}

export function SearchModal({ open: controlledOpen, onOpenChange }: SearchModalProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResults | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  // Use controlled or internal state
  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  // Debounce timer ref
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  // Fetch search results
  const fetchResults = React.useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults(null)
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
      const data = await response.json()

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
  }, [])

  // Debounced search
  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(query)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, fetchResults])

  // Keyboard shortcut listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setResults(null)
      setHasSearched(false)
    }
  }, [open])

  // Navigation handlers
  const handlePartSelect = (part: SearchResultPart) => {
    setOpen(false)
    router.push(`/part/${part.sku}`)
  }

  const handleDeviceSelect = (device: SearchResultDevice) => {
    setOpen(false)
    router.push(`/device/${device.slug}`)
  }

  const handleBrandSelect = (brand: SearchResultBrand) => {
    setOpen(false)
    router.push(`/brand/${brand.slug}`)
  }

  const handleViewAllResults = () => {
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleSuggestionClick = (term: string) => {
    setQuery(term)
  }

  // Calculate total results
  const totalResults = results
    ? results.parts.length + results.devices.length + results.brands.length
    : 0

  const hasResults = results && totalResults > 0

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search FusionCell"
      description="Search for parts, devices, and brands"
      className="max-w-2xl"
    >
      <CommandInput
        placeholder="Search parts, devices, SKUs..."
        value={query}
        onValueChange={setQuery}
        autoFocus
      />
      <CommandList className="max-h-[400px]">
        {/* Loading state */}
        {loading && <SearchLoading />}

        {/* Initial state - no search yet */}
        {!loading && !hasSearched && (
          <CommandEmpty>
            <InitialState />
          </CommandEmpty>
        )}

        {/* Empty state with suggestions */}
        {!loading && hasSearched && !hasResults && query.length >= 2 && (
          <CommandEmpty>
            <EmptyState query={query} onSuggestionClick={handleSuggestionClick} />
          </CommandEmpty>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <>
            {/* Parts */}
            {results!.parts.length > 0 && (
              <CommandGroup heading="Parts">
                {results!.parts.map((part) => (
                  <PartResultItem
                    key={part.id}
                    part={part}
                    onSelect={() => handlePartSelect(part)}
                  />
                ))}
              </CommandGroup>
            )}

            {/* Devices */}
            {results!.devices.length > 0 && (
              <>
                {results!.parts.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Devices">
                  {results!.devices.map((device) => (
                    <DeviceResultItem
                      key={device.id}
                      device={device}
                      onSelect={() => handleDeviceSelect(device)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Brands */}
            {results!.brands.length > 0 && (
              <>
                {(results!.parts.length > 0 || results!.devices.length > 0) && (
                  <CommandSeparator />
                )}
                <CommandGroup heading="Brands">
                  {results!.brands.map((brand) => (
                    <BrandResultItem
                      key={brand.id}
                      brand={brand}
                      onSelect={() => handleBrandSelect(brand)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}

            {/* View all results */}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={handleViewAllResults}
                className="justify-center text-center text-primary font-medium"
              >
                <Search className="w-4 h-4 mr-2" />
                View all {totalResults} results for "{query}"
                <ArrowRight className="w-4 h-4 ml-2" />
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

// Export a hook for using the search modal
export function useSearchModal() {
  const [open, setOpen] = React.useState(false)

  const openModal = React.useCallback(() => setOpen(true), [])
  const closeModal = React.useCallback(() => setOpen(false), [])
  const toggleModal = React.useCallback(() => setOpen((prev) => !prev), [])

  return {
    open,
    setOpen,
    openModal,
    closeModal,
    toggleModal,
    SearchModalComponent: () => <SearchModal open={open} onOpenChange={setOpen} />,
  }
}
