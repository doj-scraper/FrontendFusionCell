"use client"

import * as React from "react"
import Link from "next/link"
import {
  Mail,
  Phone,
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
  ExternalLink,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/return-policy", label: "Return Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/shipping-info", label: "Shipping Info" },
]

const deviceCategories = [
  { href: "/brand/apple", label: "Apple" },
  { href: "/brand/samsung", label: "Samsung" },
  { href: "/brand/motorola", label: "Motorola" },
  { href: "/brand/google", label: "Google" },
]

const socialLinks = [
  { href: "https://facebook.com/fusioncell", label: "Facebook", icon: Facebook },
  { href: "https://ebay.com/usr/fusioncell", label: "eBay", icon: ExternalLink },
  { href: "https://youtube.com/@fusioncell", label: "YouTube", icon: Youtube },
  { href: "https://linkedin.com/company/fusioncell", label: "LinkedIn", icon: Linkedin },
  { href: "https://instagram.com/fusioncell", label: "Instagram", icon: Instagram },
]

// Static year to avoid hydration mismatch during year transitions
const CURRENT_YEAR = 2025

export function Footer() {

  return (
    <footer
      className="bg-muted/30 border-t"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block"
              aria-label="FusionCell Home"
            >
              <span className="text-xl font-bold text-primary">FusionCell</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your trusted wholesale partner for high-quality cell phone repair parts.
              We provide premium components for repair shops and technicians across
              the country.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
            <nav aria-label="Footer quick links">
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Device Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Device Categories</h3>
            <nav aria-label="Device categories">
              <ul className="space-y-2">
                {deviceCategories.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
            <address className="not-italic space-y-3">
              <a
                href="mailto:sales@fusioncell.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>sales@fusioncell.com</span>
              </a>
              <a
                href="tel:1-800-387-4661"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>1-800-FUSION-1</span>
              </a>
              <p className="text-sm text-muted-foreground">
                1400 Market Street<br />
                Tomball, TX 77375<br />
                United States
              </p>
            </address>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-foreground mb-3">Follow Us</h4>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Follow us on ${social.label}`}
                  >
                    <social.icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {CURRENT_YEAR} FusionCell. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
