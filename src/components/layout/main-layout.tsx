"use client"

import * as React from "react"

import { Header } from "./header"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className="flex-1"
        role="main"
        id="main-content"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
