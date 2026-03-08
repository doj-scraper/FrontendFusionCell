"use client"

import * as React from "react"
import { ShoppingCart, Eye, Package } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Quality badge color mapping
const qualityVariants: Record<string, "default" | "secondary" | "outline"> = {
  OEM: "default",
  Premium: "default",
  Aftermarket: "secondary",
  "High Quality": "default",
  Refurbished: "outline",
}

// Stock status type
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface Part {
  id: string
  sku: string
  name: string
  slug: string
  description?: string | null
  price: number
  comparePrice?: number | null
  image?: string | null
  quality?: string | null
  color?: string | null
  isFeatured?: boolean
  category?: {
    id: string
    name: string
    slug: string
    icon?: string | null
  } | null
  inventory?: {
    quantity: number
    reserved: number
    available: number
    location?: string | null
  } | null
}

export interface PartCardProps {
  part: Part
  onAddToCart?: (part: Part) => void
  onQuickView?: (part: Part) => void
  className?: string
}

// Helper to determine stock status
function getStockStatus(inventory?: Part["inventory"]): StockStatus {
  if (!inventory) return "out_of_stock"
  const available = inventory.available
  if (available <= 0) return "out_of_stock"
  if (available <= 10) return "low_stock"
  return "in_stock"
}

// Helper to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

// Stock status badge component
function StockBadge({ status }: { status: StockStatus }) {
  const config = {
    in_stock: {
      label: "In Stock",
      className: "bg-success text-success-foreground border-success/40",
    },
    low_stock: {
      label: "Low Stock",
      className: "bg-warning text-warning-foreground border-warning/40",
    },
    out_of_stock: {
      label: "Out of Stock",
      className: "bg-destructive text-destructive-foreground border-destructive/40",
    },
  }

  const { label, className } = config[status]

  return (
    <Badge
      variant="outline"
      className={cn("text-xs", className)}
    >
      {label}
    </Badge>
  )
}

export function PartCard({
  part,
  onAddToCart,
  onQuickView,
  className,
}: PartCardProps) {
  const stockStatus = getStockStatus(part.inventory)
  const isOutOfStock = stockStatus === "out_of_stock"
  const discount = part.comparePrice
    ? Math.round(((part.comparePrice - part.price) / part.comparePrice) * 100)
    : null

  return (
    <Card
      className={cn(
        "group transition-colors duration-fast ease-default hover:bg-accent",
        isOutOfStock && "opacity-75",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Part Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {part.image ? (
              <img
                src={part.image}
                alt={part.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {part.isFeatured && (
                <Badge className="bg-highlight-soft text-xs text-highlight-foreground">
                  Featured
                </Badge>
              )}
              {discount && (
                <Badge variant="destructive" className="text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Quick View Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onQuickView?.(part)
              }}
              aria-label={`Quick view ${part.name}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Part Info */}
          <div className="flex flex-col gap-1.5">
            {/* SKU & Stock */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {part.sku}
              </span>
              <StockBadge status={stockStatus} />
            </div>

            {/* Name */}
            <span className="font-semibold text-sm line-clamp-2" title={part.name}>
              {part.name}
            </span>

            {/* Category & Quality */}
            <div className="flex items-center gap-2 flex-wrap">
              {part.category && (
                <Badge variant="outline" className="text-xs">
                  {part.category.name}
                </Badge>
              )}
              {part.quality && (
                <Badge
                  variant={qualityVariants[part.quality] || "outline"}
                  className="text-xs"
                >
                  {part.quality}
                </Badge>
              )}
              {part.color && (
                <Badge variant="secondary" className="text-xs">
                  {part.color}
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-primary">
                {formatPrice(part.price)}
              </span>
              {part.comparePrice && part.comparePrice > part.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(part.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart?.(part)
            }}
            aria-label={`Add ${part.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton version for loading states
export function PartCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Image Skeleton */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          
          {/* Info Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Button Skeleton */}
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
