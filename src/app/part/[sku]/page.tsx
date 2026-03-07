"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  ChevronRight, 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Smartphone, 
  Info,
  ArrowLeft,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"

// Types
interface PartDetail {
  id: string
  sku: string
  name: string
  slug: string
  description?: string | null
  price: number
  comparePrice?: number | null
  image?: string | null
  images: string[]
  quality: string
  color?: string | null
  weight?: number | null
  barcode?: string | null
  minOrderQty: number
  device: {
    id: string
    name: string
    slug: string
    modelNumber?: string | null
    brand: {
      name: string
      slug: string
    }
  }
  category?: {
    name: string
    slug: string
  } | null
  inventory?: {
    available: number
    isLowStock: boolean
  } | null
}

export default function ProductDetailPage() {
  const { sku } = useParams()
  const router = useRouter()
  const [part, setPart] = React.useState<PartDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeImage, setActiveImage] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)

  React.useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`/api/parts/${sku}`)
        const data = await response.json()
        if (data.success) {
          setPart(data.data)
          setActiveImage(data.data.image || null)
          setQuantity(data.data.minOrderQty || 1)
        }
      } catch (error) {
        console.error("Failed to fetch part:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPart()
  }, [sku])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!part) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Part Not Found</h1>
        <p className="text-muted-foreground mb-6">The SKU you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/search")}>Return to Search</Button>
      </div>
    )
  }

  const allImages = [part.image, ...part.images].filter(Boolean) as string[]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => router.push("/")} className="hover:text-primary transition-colors">Home</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <button onClick={() => router.push(`/brand/${part.device.brand.slug}`)} className="hover:text-primary transition-colors">{part.device.brand.name}</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <button onClick={() => router.push(`/device/${part.device.slug}`)} className="hover:text-primary transition-colors">{part.device.name}</button>
        <ChevronRight className="w-4 h-4 mx-2 flex-shrink-0" />
        <span className="text-foreground font-medium truncate">{part.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-white border rounded-2xl overflow-hidden relative flex items-center justify-center">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={part.name} 
                className="max-w-full max-h-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="w-16 h-16 mb-2 opacity-20" />
                <span>No image available</span>
              </div>
            )}
            <Badge className="absolute top-4 left-4 bg-white/90 text-black border shadow-sm hover:bg-white">
              {part.quality}
            </Badge>
          </div>
          
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-square rounded-lg border-2 overflow-hidden bg-white p-1 transition-all",
                    activeImage === img ? "border-primary shadow-sm" : "border-transparent hover:border-muted-foreground/30"
                  )}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Conversion */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-bold border-primary/30 text-primary">
                {part.category?.name || "Part"}
              </Badge>
              <span className="text-sm text-muted-foreground">SKU: <span className="text-foreground font-mono font-bold select-all bg-muted px-1.5 py-0.5 rounded">{part.sku}</span></span>
            </div>
            <h1 className="text-3xl font-bold leading-tight mb-4">{part.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary">${part.price.toFixed(2)}</span>
              {part.comparePrice && (
                <span className="text-xl text-muted-foreground line-through">${part.comparePrice.toFixed(2)}</span>
              )}
              <span className="text-sm text-muted-foreground ml-2">Wholesale pricing</span>
            </div>

            <Separator className="my-6" />

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Device:</span>
                <span className="font-medium">{part.device.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground">Quality:</span>
                <span className="font-medium">{part.quality}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Stock:</span>
                {part.inventory && part.inventory.available > 0 ? (
                  <span className="text-emerald-600 font-bold">{part.inventory.available} available</span>
                ) : (
                  <span className="text-destructive font-bold">Out of Stock</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">MOQ:</span>
                <span className="font-medium">{part.minOrderQty} units</span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <Card className="border-2 border-primary/10 shadow-sm bg-muted/30">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center border rounded-lg bg-white overflow-hidden h-11">
                  <button 
                    className="px-3 hover:bg-muted transition-colors disabled:opacity-30"
                    onClick={() => setQuantity(q => Math.max(part.minOrderQty, q - 1))}
                    disabled={quantity <= part.minOrderQty}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(part.minOrderQty, parseInt(e.target.value) || part.minOrderQty))}
                    className="w-12 text-center font-bold border-x h-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    className="px-3 hover:bg-muted transition-colors"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    +
                  </button>
                </div>
                <Button size="lg" className="flex-1 h-11 gap-2 text-md font-bold shadow-md shadow-primary/20">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Minimum order quantity for this item is {part.minOrderQty} units.
              </p>
            </CardContent>
          </Card>

          {/* Compatibility Badge */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Compatibility Confidence</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">Verified fit for {part.device.name} ({part.device.modelNumber || "All variants"}). Technical support available for installation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-md font-semibold"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specs" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-md font-semibold"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger 
              value="compatibility" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-md font-semibold"
            >
              Compatibility
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-8 prose prose-slate dark:prose-invert max-w-none">
            {part.description ? (
              <p>{part.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description available for this part.</p>
            )}
          </TabsContent>
          <TabsContent value="specs" className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {[
                { label: "SKU", value: part.sku },
                { label: "Category", value: part.category?.name },
                { label: "Quality Grade", value: part.quality },
                { label: "Color", value: part.color || "N/A" },
                { label: "Weight", value: part.weight ? `${part.weight}g` : "N/A" },
                { label: "Barcode", value: part.barcode || "N/A" },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium">{spec.value || "N/A"}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="compatibility" className="py-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Models</CardTitle>
                <CardDescription>This part is verified to work with the following hardware.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="w-12 h-12 rounded bg-white border flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold">{part.device.name}</p>
                    <p className="text-sm text-muted-foreground">Model: {part.device.modelNumber || "All versions"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
