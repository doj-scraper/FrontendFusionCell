import * as React from 'react'
import Link from 'next/link'
import {
  FileText,
  Shield,
  Scale,
  AlertCircle,
  Users,
  Lock,
  Globe,
  RefreshCcw,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const termsSections = [
  {
    icon: FileText,
    title: 'Terms of Service',
    content: [
      {
        heading: 'Acceptance of Terms',
        text: 'By accessing and using the FusionCell website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
      },
      {
        heading: 'Account Registration',
        text: 'To access certain features of our service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
      },
      {
        heading: 'Orders and Payments',
        text: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason. Prices are subject to change without notice. Payment must be received before orders are processed.',
      },
      {
        heading: 'Product Information',
        text: 'We make every effort to display products and pricing accurately. However, we do not guarantee that product descriptions, images, or pricing are error-free. We reserve the right to correct errors and update information at any time.',
      },
    ],
  },
]

const privacySections = [
  {
    icon: Lock,
    title: 'Privacy Policy Summary',
    content: [
      {
        heading: 'Information We Collect',
        text: 'We collect information you provide directly, including name, email, phone, company, shipping address, and payment information. We also collect usage data and device information automatically.',
      },
      {
        heading: 'How We Use Your Information',
        text: 'We use your information to process orders, communicate with you, improve our services, and comply with legal obligations. We do not sell your personal information to third parties.',
      },
      {
        heading: 'Data Security',
        text: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      },
      {
        heading: 'Cookies and Tracking',
        text: 'We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookie settings through your browser preferences.',
      },
    ],
  },
]

const userResponsibilities = [
  'Provide accurate and complete information when creating an account or placing orders',
  'Maintain the security of your account credentials',
  'Use our services only for lawful purposes and in compliance with these terms',
  'Not interfere with or disrupt the operation of our website or services',
  'Not attempt to gain unauthorized access to any part of our systems',
  'Not use automated systems to access our website without permission',
  'Report any suspected security vulnerabilities to our team',
  'Comply with all applicable laws and regulations',
]

const liabilityItems = [
  {
    title: 'Disclaimer of Warranties',
    text: 'Our products and services are provided "as is" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.',
  },
  {
    title: 'Limitation of Liability',
    text: 'To the fullest extent permitted by law, FusionCell shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.',
  },
  {
    title: 'Maximum Liability',
    text: 'Our total liability for any claims arising from your use of our services shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.',
  },
  {
    title: 'Indemnification',
    text: 'You agree to indemnify and hold harmless FusionCell and its affiliates from any claims, damages, or expenses arising from your use of our services or violation of these terms.',
  },
]

const additionalTerms = [
  {
    icon: Globe,
    title: 'Governing Law',
    description:
      'These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.',
  },
  {
    icon: RefreshCcw,
    title: 'Changes to Terms',
    description:
      'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of the modified terms.',
  },
  {
    icon: Scale,
    title: 'Dispute Resolution',
    description:
      'Any disputes arising from these terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.',
  },
  {
    icon: Users,
    title: 'Entire Agreement',
    description:
      'These terms, along with our Privacy Policy and Return Policy, constitute the entire agreement between you and FusionCell regarding your use of our services.',
  },
]

export default function TermsPage() {
  const lastUpdated = 'January 1, 2025'

  return (
    <main className="min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Terms & <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using our services. By
            accessing our website or making a purchase, you agree to be bound by
            these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Terms of Service Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Terms of Service</h2>
            </div>
            <div className="space-y-6">
              {termsSections[0].content.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.heading}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* Privacy Policy Summary */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Privacy Policy Summary</h2>
            </div>
            <div className="space-y-6">
              {privacySections[0].content.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.heading}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-6 bg-muted/30">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  For a complete overview of how we collect, use, and protect
                  your personal information, please see our{' '}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    full Privacy Policy
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* User Responsibilities */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">User Responsibilities</h2>
            </div>
            <Card>
              <CardHeader>
                <CardDescription>
                  As a user of our services, you agree to the following
                  responsibilities:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {userResponsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* Limitation of Liability */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            </div>
            <div className="space-y-4">
              {liabilityItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator className="my-12 max-w-4xl mx-auto" />

        {/* Additional Terms */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Additional Terms</h2>
              <p className="text-muted-foreground">
                Other important legal information
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {additionalTerms.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <Card className="max-w-2xl mx-auto bg-muted/30">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about these terms and conditions,
                please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@fusioncell.com"
                  className="text-primary hover:underline"
                >
                  support@fusioncell.com
                </a>
                <span className="hidden sm:inline text-muted-foreground">
                  |
                </span>
                <a
                  href="tel:1-800-387-4661"
                  className="text-primary hover:underline"
                >
                  1-800-FUSION-1
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
