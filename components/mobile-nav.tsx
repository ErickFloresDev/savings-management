"use client"

import { Home, DollarSign, CreditCard, PiggyBank, Building2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", icon: Home, label: "Inicio" },
    { href: "/dashboard/income", icon: DollarSign, label: "Ingresos" },
    { href: "/dashboard/expenses", icon: CreditCard, label: "Gastos" },
    { href: "/dashboard/savings", icon: PiggyBank, label: "Ahorros" },
    { href: "/dashboard/bank", icon: Building2, label: "Banca" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full",
                isActive ? "text-foreground font-extrabold" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5"/>
              <span className="text-xs">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
