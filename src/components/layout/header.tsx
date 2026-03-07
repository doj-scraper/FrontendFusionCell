"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
  Command,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { SearchModal } from "@/components/search-modal"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/return-policy", label: "Return Policy" },
  { href: "/terms", label: "Terms" },
]

// Brand navigation for quick device access
const brandLinks = [
  { href: "/brand/apple", label: "Apple" },
  { href: "/brand/samsung", label: "Samsung" },
  { href: "/brand/motorola", label: "Motorola" },
  { href: "/brand/google", label: "Google" },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Placeholder cart count - would come from cart context/store
  const cartCount = 0

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          aria-label="FusionCell Home"
        >
          <span className="text-xl font-bold text-primary">FusionCell</span>
        </Link>

        {/* Desktop Search Bar - 48px height per design system */}
        <button
          className="hidden md:flex flex-1 max-w-md mx-8 items-center h-12 px-4 rounded-xl border border-input bg-background text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search"
        >
          <Search className="h-5 w-5 mr-3" aria-hidden="true" />
          <span className="flex-1 text-left">Search parts, devices, SKUs...</span>
          <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs"><Command className="h-3 w-3" /></span>K
          </kbd>
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center space-x-1"
          aria-label="Main navigation"
        >
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={link.href}>
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          )}

          {/* Account Icon */}
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/account" aria-label="Account">
              <User className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>

          {/* Cart Icon with Badge */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative"
          >
            <Link href="/cart" aria-label={`Shopping cart with ${cartCount} items`}>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  aria-hidden="true"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                aria-expanded={isOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Search */}
                <button
                  className="flex items-center h-12 px-4 rounded-xl border border-input bg-background text-muted-foreground text-sm"
                  onClick={() => {
                    setIsOpen(false)
                    setTimeout(() => setSearchOpen(true), 100)
                  }}
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5 mr-3" aria-hidden="true" />
                  <span>Search parts, devices, SKUs...</span>
                </button>

                {/* Mobile Brand Links */}
                <div className="space-y-1">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Shop by Brand
                  </p>
                  {brandLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Navigation Links */}
                <nav
                  className="flex flex-col space-y-2"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Theme Toggle */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  >
                    <span>Theme</span>
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Moon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Brand Navigation Bar - Desktop only */}
      <div className="hidden md:block border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <nav
            className="flex items-center gap-6 h-10"
            aria-label="Brand navigation"
          >
            {brandLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                {index < brandLinks.length - 1 && (
                  <span className="text-muted-foreground/30" aria-hidden="true">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
