import * as React from 'react'
import Link from 'next/link'
import {
  Package,
  RefreshCcw,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const returnSteps = [
  {
    step: 1,
    title: 'Contact Us',
    description:
      'Reach out to our support team via email or phone to initiate your return. Provide your order number and reason for return.',
  },
  {
    step: 2,
    title: 'Get Authorization',
    description:
      'We\'ll review your request and issue a Return Authorization (RA) number if your return is approved.',
  },
  {
    step: 3,
    title: 'Pack & Ship',
    description:
      'Pack the item(s) securely in original packaging if possible. Write the RA number clearly on the package.',
  },
  {
    step: 4,
    title: 'Receive Refund',
    description:
      'Once we receive and inspect the returned item(s), we\'ll process your refund within 5-7 business days.',
  },
]

const returnReasons = [
  {
    reason: 'Defective or Damaged',
    description: 'Full refund or replacement at no extra cost.',
    icon: AlertTriangle,
  },
  {
    reason: 'Wrong Item Received',
    description: 'Full refund or exchange for correct item.',
    icon: Package,
  },
  {
    reason: 'Changed Mind',
    description: 'Refund minus restocking fee and return shipping.',
    icon: RefreshCcw,
  },
  {
    reason: 'Quality Not as Expected',
    description: 'Subject to inspection and approval.',
    icon: CheckCircle,
  },
]

const nonReturnableItems = [
  'Parts that have been installed or used',
  'Items damaged due to improper installation',
  'Products without original packaging',
  'Items returned after the 30-day window',
  'Special orders or custom items',
  'Clearance or final sale items',
]

const faqItems = [
  {
    question: 'How long do I have to return an item?',
    answer:
      'You have 30 days from the date of delivery to initiate a return. After this period, returns cannot be accepted.',
  },
  {
    question: 'Who pays for return shipping?',
    answer:
      'If the return is due to our error (defective item, wrong item shipped), we will provide a prepaid shipping label. For other returns, the customer is responsible for return shipping costs.',
  },
  {
    question: 'When will I receive my refund?',
    answer:
      'Refunds are processed within 5-7 business days after we receive and inspect the returned item(s). The refund will be credited to the original payment method.',
  },
  {
    question: 'Can I exchange an item instead of returning it?',
    answer:
      'Yes! We offer exchanges for items of equal or greater value. Contact our support team to arrange an exchange.',
  },
  {
    question: 'What if my return is denied?',
    answer:
      'If your return is denied, we will contact you with the reason. You can choose to have the item returned to you (at your expense) or we may dispose of it after 30 days.',
  },
]

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Return <span className="text-primary">Policy</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We want you to be completely satisfied with your purchase. If
            you&apos;re not happy with your order, we&apos;re here to help make
            it right.
          </p>
        </div>

        {/* Return Eligibility Card */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">30-Day Return Policy</CardTitle>
              <CardDescription>
                Items can be returned within 30 days of delivery for a full
                refund or exchange
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                All returns must be in original condition, unused, and in
                original packaging. Some restrictions apply.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Return Process */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Return Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to initiate and complete your return
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {returnSteps.map((step) => (
              <Card key={step.step}>
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* Return Reasons & Refunds */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Refund Policy
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Refund amounts depend on the reason for return and condition of
              the item
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {returnReasons.map((item) => (
              <Card key={item.reason}>
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.reason}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Restocking Fees */}
        <section className="mb-16">
          <Card className="max-w-4xl mx-auto bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Restocking Fees
              </CardTitle>
              <CardDescription>
                A restocking fee may apply depending on the return reason
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Defective or Damaged Items</span>
                  <span className="font-semibold text-primary">No Fee</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Wrong Item Shipped (Our Error)</span>
                  <span className="font-semibold text-primary">No Fee</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Changed Mind / No Longer Needed</span>
                  <span className="font-semibold">15% Restocking Fee</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Items Not in Original Packaging</span>
                  <span className="font-semibold">Up to 25% Fee</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Non-Returnable Items */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Non-Returnable Items
                </CardTitle>
                <CardDescription>
                  The following items cannot be returned or refunded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {nonReturnableItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about our return policy
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Need to Start a Return?</h2>
              <p className="opacity-90 mb-6">
                Contact our support team to initiate your return. We&apos;re
                here to help!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/contact">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
