'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'sales@fusioncell.com',
    href: 'mailto:sales@fusioncell.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '1-800-FUSION-1',
    href: 'tel:1-800-387-4661',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: '1400 Market Street\nTomball, TX 77375\nUnited States',
    href: null,
  },
]

const businessHours = [
  { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM CST' },
  { day: 'Saturday', hours: '9:00 AM - 2:00 PM CST' },
  { day: 'Sunday', hours: 'Closed' },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSuccess(true)
        form.reset()
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      console.error('Contact form error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our products or wholesale program? We&apos;re
            here to help. Reach out to our team and we&apos;ll get back to you
            as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We&apos;ll get back to you
                      within 24 hours.
                    </p>
                    <Button onClick={() => setIsSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="(555) 123-4567"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your company name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="How can we help you?"
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{info.title}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {businessHours.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex justify-between text-sm"
                    >
                      <span className="font-medium">{schedule.day}</span>
                      <span
                        className={
                          schedule.hours === 'Closed'
                            ? 'text-muted-foreground'
                            : 'text-primary'
                        }
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Map integration coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-16" />

        {/* FAQ Teaser */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for? Check out our FAQ
            section or reach out to our support team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Card className="text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What is your return policy?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer a 30-day return policy on most items. See our{' '}
                  <a
                    href="/return-policy"
                    className="text-primary hover:underline"
                  >
                    Return Policy
                  </a>{' '}
                  for details.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Do you offer wholesale pricing?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer competitive wholesale pricing for repair shops
                  and bulk orders. Contact us to apply.
                </p>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How fast is shipping?</h3>
                <p className="text-sm text-muted-foreground">
                  We offer same-day shipping on orders placed before 2 PM CST.
                  Free shipping on orders over $150.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
