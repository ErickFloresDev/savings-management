"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Calendar, Wallet, BriefcaseBusiness, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function IncomePage() {
  const { income, addIncome } = useData()
  const [open, setOpen] = useState(false)

  const [visibleCount, setVisibleCount] = useState(5)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    incomeType: "account" as "cash" | "account",
    amount: "",
    category: "salary" as "salary" | "other",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addIncome({
      date: formData.date,
      incomeType: formData.incomeType,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
    })
    setFormData({
      date: new Date().toISOString().split("T")[0],
      incomeType: "account",
      amount: "",
      category: "salary",
    })
    setOpen(false)
  }

  const sortedIncome = [...income].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Income</h1>
          <p className="text-sm text-muted-foreground">Track your income sources</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Add Income</DialogTitle>
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
                <Label htmlFor="incomeType" className="text-sm">
                  Income Type
                </Label>
                <Select
                  value={formData.incomeType}
                  onValueChange={(value: "cash" | "account") => setFormData({ ...formData, incomeType: value })}
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
                  onValueChange={(value: "salary" | "other") => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary" className="text-sm">
                      Salary
                    </SelectItem>
                    <SelectItem value="other" className="text-sm">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full text-sm">
                Add Income
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {income.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Salary Income</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/. {income .filter((i) => i.category === "salary") .reduce((sum, i) => sum + i.amount, 0) .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Other Income</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/. {income .filter((i) => i.category === "other") .reduce((sum, i) => sum + i.amount, 0) .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedIncome
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
                    <p className="text-xs text-muted-foreground capitalize">{item.incomeType}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">S/. {item.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {visibleCount < sortedIncome.length && (
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

        </CardContent>
      </Card>
    </div>
  )
}
