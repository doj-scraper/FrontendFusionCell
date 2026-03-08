"use client"

import * as React from "react"
import { Smartphone, ChevronRight, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Device {
  id: string
  name: string
  slug: string
  modelNumber?: string | null
  image?: string | null
  releaseYear?: number | null
  description?: string | null
  partCount: number
}

export interface DeviceCardProps {
  device: Device
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

export function DeviceCard({
  device,
  onClick,
  isSelected = false,
  className,
}: DeviceCardProps) {
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
      aria-label={`View ${device.name} parts, ${device.partCount} parts available`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Device Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {device.image ? (
              <img
                src={device.image}
                alt={device.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            {/* Parts Count Overlay */}
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 text-xs"
            >
              <Wrench className="w-3 h-3 mr-1" />
              {device.partCount}
            </Badge>
          </div>

          {/* Device Info */}
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {device.name}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {device.modelNumber && (
                <span className="line-clamp-1">{device.modelNumber}</span>
              )}
              {device.releaseYear && (
                <span>({device.releaseYear})</span>
              )}
            </div>
          </div>

          {/* Expand Indicator */}
          <div className="flex items-center justify-end text-xs text-muted-foreground group-hover:text-primary transition-colors">
            <span>View parts</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton version for loading states
export function DeviceCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Device Image Skeleton */}
          <div className="aspect-square w-full rounded-lg bg-muted" />
          
          {/* Device Info Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
          
          {/* Bottom Skeleton */}
          <div className="flex justify-end">
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
