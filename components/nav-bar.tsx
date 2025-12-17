"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, DollarSign, CreditCard, PiggyBank, Building2, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function NavBar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("username")
    router.push("/login")
  }

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">

            {/* LOGO + TEXTO */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/pig.png"
              alt="Savings Manager"
              width={28}
              height={28}
              priority
            />
            <span className="font-semibold text-lg line-clamp-1">
              Save me
            </span>
          </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/income">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  Income
                </Button>
              </Link>
              <Link href="/dashboard/expenses">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Expenses
                </Button>
              </Link>
              <Link href="/dashboard/savings">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <PiggyBank className="h-4 w-4" />
                  Savings
                </Button>
              </Link>
              <Link href="/dashboard/bank">
                <Button variant="ghost" size="sm" className="gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  Bank
                </Button>
              </Link>
            </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-sm">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
