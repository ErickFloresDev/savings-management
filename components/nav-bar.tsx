"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, DollarSign, CreditCard, PiggyBank, Building2, LinkIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UrlModal } from "@/components/url-modal"

export function NavBar() {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)

  const handleUrlSaved = () => {
    // Reload the page to fetch new data with the updated URL
    window.location.reload()
  }

  return (
    <>
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* LOGO + TEXTO */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/pig.png" alt="Savings Manager" width={28} height={28} priority />
              <span className="font-semibold text-lg line-clamp-1">Save me</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <Home className="h-4 w-4" />
                  Inicio
                </Button>
              </Link>
              <Link href="/dashboard/income">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  Ingresos
                </Button>
              </Link>
              <Link href="/dashboard/expenses">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Gastos
                </Button>
              </Link>
              <Link href="/dashboard/savings">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <PiggyBank className="h-4 w-4" />
                  Ahorros
                </Button>
              </Link>
              <Link href="/dashboard/bank">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  Banca
                </Button>
              </Link>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsUrlModalOpen(true)} className="gap-2 text-sm">
              <LinkIcon className="h-4 w-4" />
              Link
            </Button>
          </div>
        </div>
      </nav>

      <UrlModal open={isUrlModalOpen} onOpenChange={setIsUrlModalOpen} onUrlSaved={handleUrlSaved} />
    </>
  )
}
