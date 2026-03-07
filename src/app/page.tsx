'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Truck,
  Shield,
  DollarSign,
  HeadphonesIcon,
  ArrowRight,
  Package,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DeviceExplorer } from '@/components/device-explorer'

// Types
interface Part {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string | null
  quality: string | null
  minOrderQty: number
  device: {
    name: string
    brand: {
      name: string
    }
  }
  inventory?: {
    available: number
  } | null
}

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
  deviceCount: number
}

// Featured Products Component
function FeaturedProducts() {
  const [parts, setParts] = React.useState<Part[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchParts() {
      try {
        const res = await fetch('/api/parts?featured=true&limit=6')
        const data = await res.json()
        if (data.success) {
          setParts(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch featured parts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchParts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (parts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No featured products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {parts.map((part) => (
        <Card
          key={part.id}
          className="overflow-hidden group hover:shadow-lg transition-shadow"
        >
          <Link href={`/parts/${part.sku}`} className="block">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {part.image ? (
                <img
                  src={part.image}
                  alt={part.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
              {part.quality && (
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {part.quality}
                </Badge>
              )}
            </div>
          </Link>
          <CardHeader className="p-4">
            <CardTitle className="text-base line-clamp-2">
              <Link
                href={`/parts/${part.sku}`}
                className="hover:text-primary transition-colors"
              >
                {part.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">
              {part.device.brand.name} • {part.device.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-primary">
                ${part.price.toFixed(2)}
              </span>
              {part.comparePrice && part.comparePrice > part.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${part.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">MOQ: {part.minOrderQty} units</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" size="sm" asChild>
              <Link href={`/parts/${part.sku}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Why Choose Us data
const whyChooseUsFeatures = [
  {
    icon: Shield,
    title: 'Quality Parts',
    description:
      'All our parts undergo rigorous quality testing to ensure they meet or exceed OEM specifications.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description:
      'Same-day shipping on orders placed before 2 PM CST. Free shipping on orders over $150.',
  },
  {
    icon: DollarSign,
    title: 'Wholesale Pricing',
    description:
      'Competitive wholesale pricing with volume discounts for repair shops and bulk orders.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Expert Support',
    description:
      'Our knowledgeable team is here to help with technical questions and product recommendations.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Quality Parts for{' '}
              <span className="text-primary">Professional Repairs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted wholesale partner for high-quality cell phone repair
              parts. Premium components, competitive prices, and reliable
              service for repair professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="#browse-devices">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Device Explorer Section */}
      <section id="browse-devices" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Browse Parts by Device
            </h2>
            <p className="text-muted-foreground mt-2">
              Select a brand and device to find the parts you need
            </p>
          </div>
          <DeviceExplorer />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Parts
              </h2>
              <p className="text-muted-foreground mt-2">
                Top-selling components trusted by repair professionals
              </p>
            </div>
            <Button variant="outline" asChild className="mt-4 md:mt-0">
              <Link href="/search">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Why Choose FusionCell Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose FusionCell?
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We&apos;re committed to providing repair professionals with the
              best parts and service in the industry
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUsFeatures.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Sales CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Stock Your Shop?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of repair professionals who trust FusionCell for
              their parts needs. Get access to wholesale pricing, volume
              discounts, and dedicated account support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Info */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Tomball, TX 77375</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">1-800-FUSION-1</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">sales@fusioncell.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Same-Day Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Expert Support</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
