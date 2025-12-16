"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Calendar, DollarSign, HandCoins, ShoppingCart, Car, TvMinimalPlay } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ExpensesPage() {
  const { expenses, addExpense } = useData()
  const [open, setOpen] = useState(false)

  const [visibleCount, setVisibleCount] = useState(5)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    paymentType: "account" as "cash" | "account",
    amount: "",
    category: "shopping" as "shopping" | "transportation" | "entertainment",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addExpense({
      date: formData.date,
      paymentType: formData.paymentType,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
    })
    setFormData({
      date: new Date().toISOString().split("T")[0],
      paymentType: "account",
      amount: "",
      category: "shopping",
    })
    setOpen(false)
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track your spending</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Add Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType" className="text-sm">
                  Payment Type
                </Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: "cash" | "account") => setFormData({ ...formData, paymentType: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash" className="text-sm">
                      Cash
                    </SelectItem>
                    <SelectItem value="account" className="text-sm">
                      Account
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: "shopping" | "transportation" | "entertainment") =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopping" className="text-sm">
                      Shopping
                    </SelectItem>
                    <SelectItem value="transportation" className="text-sm">
                      Transportation
                    </SelectItem>
                    <SelectItem value="entertainment" className="text-sm">
                      Entertainment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full text-sm">
                Add Expense
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shopping</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/. {expenses
                .filter((e) => e.category === "shopping")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transportation</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/. {expenses
                .filter((e) => e.category === "transportation")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entertainment</CardTitle>
            <TvMinimalPlay  className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/. {expenses
                .filter((e) => e.category === "entertainment")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedExpenses
              .slice(0, visibleCount)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{item.category}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{item.paymentType}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">S/. {item.amount.toFixed(2)}</p>
                </div>
            ))}

            {visibleCount < sortedExpenses.length && (
              <div className="pt-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                >
                  Ver más
                </Button>
              </div>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
