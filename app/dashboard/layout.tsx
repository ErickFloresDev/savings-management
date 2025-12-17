"use client"

import type React from "react"

import { NavBar } from "@/components/nav-bar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#eceff967]">
      <NavBar />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">{children}</main>
      <MobileNav />
    </div>
  )
}
