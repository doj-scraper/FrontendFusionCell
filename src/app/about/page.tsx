import * as React from 'react'
import Link from 'next/link'
import {
  Target,
  Heart,
  Users,
  Award,
  Shield,
  Truck,
  Clock,
  CheckCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const companyValues = [
  {
    icon: Shield,
    title: 'Quality First',
    description:
      'We never compromise on quality. Every part we sell undergoes rigorous testing to ensure it meets or exceeds OEM specifications.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description:
      'Our customers are at the heart of everything we do. We listen, adapt, and continuously improve to serve you better.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description:
      'Honesty and transparency guide our business practices. What you see is what you get – no surprises, no hidden fees.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We strive for excellence in every aspect of our business, from product sourcing to customer service and beyond.',
  },
]

const whyChooseUs = [
  {
    icon: CheckCircle,
    title: 'Premium Quality Parts',
    description:
      'All parts are tested and quality-checked before shipping to ensure reliability and customer satisfaction.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Shipping',
    description:
      'Same-day shipping on orders placed before 2 PM. Multiple shipping options to meet your needs.',
  },
  {
    icon: Clock,
    title: 'Dedicated Support',
    description:
      'Our experienced team provides technical support and product recommendations when you need them.',
  },
  {
    icon: Award,
    title: 'Competitive Pricing',
    description:
      'Wholesale pricing with volume discounts available. Get more value for your repair business.',
  },
]

const stats = [
  { value: '10+', label: 'Years in Business' },
  { value: '50K+', label: 'Parts in Stock' },
  { value: '5K+', label: 'Active Customers' },
  { value: '99%', label: 'Satisfaction Rate' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About <span className="text-primary">FusionCell</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your trusted wholesale partner for high-quality cell phone repair
            parts. We&apos;ve been serving repair professionals across the
            country for over a decade.
          </p>
        </div>

        {/* Our Story Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  FusionCell was founded with a simple mission: to provide
                  repair professionals with reliable access to high-quality cell
                  phone repair parts at competitive wholesale prices.
                </p>
                <p>
                  What started as a small operation has grown into one of the
                  most trusted names in the repair parts industry. Over the
                  years, we&apos;ve built strong relationships with
                  manufacturers and suppliers worldwide, allowing us to source
                  the best components for our customers.
                </p>
                <p>
                  Today, we serve thousands of repair shops, technicians, and
                  businesses across the country, providing them with the parts
                  they need to keep their customers connected.
                </p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-xl p-8 h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">FC</div>
                <p className="text-muted-foreground">Est. 2014</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-20">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To empower repair professionals with high-quality parts,
                competitive pricing, and exceptional service – enabling them to
                deliver outstanding repairs and grow their businesses with
                confidence.
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Our Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at FusionCell
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value) => (
              <Card key={value.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Why Choose FusionCell */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why Choose FusionCell?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s what sets us apart from the competition
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyChooseUs.map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-muted/30">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Partner with Us?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of repair professionals who trust FusionCell for
                their parts needs. Contact us today to learn more about our
                wholesale program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
