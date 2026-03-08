"use client"

import * as React from "react"
import { Smartphone, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Brand icons mapping
const brandIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  apple: Smartphone,
  samsung: Smartphone,
  motorola: Smartphone,
  google: Smartphone,
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string | null
  description?: string | null
  deviceCount: number
}

export interface BrandCardProps {
  brand: Brand
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

export function BrandCard({
  brand,
  onClick,
  isSelected = false,
  className,
}: BrandCardProps) {
  const BrandIcon = brandIcons[brand.slug.toLowerCase()] || Smartphone

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors duration-fast ease-default hover:bg-accent group",
        isSelected && "border-primary bg-primary text-primary-foreground",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${brand.name} devices, ${brand.deviceCount} devices available`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Brand Logo/Icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <BrandIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Brand Info */}
            <div className="flex flex-col">
              <span className="font-semibold text-base">{brand.name}</span>
              {brand.description && (
                <span className="text-sm text-muted-foreground line-clamp-1">
                  {brand.description}
                </span>
              )}
            </div>
          </div>

          {/* Device Count Badge & Arrow */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {brand.deviceCount} {brand.deviceCount === 1 ? "device" : "devices"}
            </Badge>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton version for loading states
export function BrandCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-20 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-muted rounded" />
            <div className="w-5 h-5 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
