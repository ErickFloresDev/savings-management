"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Calendar, HandCoins, ShoppingCart, Car, Pencil, Trash2, EllipsisVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useData()
  const [open, setOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const [visibleCount, setVisibleCount] = useState(5)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    paymentType: "account" as "cash" | "account",
    amount: "",
    category: "shopping" as "shopping" | "transportation" | "entertainment",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingExpense) {
        updateExpense(editingExpense, {
          date: formData.date,
          paymentType: formData.paymentType,
          amount: Number.parseFloat(formData.amount),
          category: formData.category,
        })
        toast({
          title: "Expense updated",
          description: "Expense has been updated successfully",
        })
        setEditingExpense(null)
      } else {
        addExpense({
          date: formData.date,
          paymentType: formData.paymentType,
          amount: Number.parseFloat(formData.amount),
          category: formData.category,
        })
        toast({
          title: "Expense added",
          description: "Expense has been added successfully",
        })
      }

      setFormData({
        date: new Date().toISOString().split("T")[0],
        paymentType: "account",
        amount: "",
        category: "shopping",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Saldo Insuficiente",
        description: error instanceof Error ? error.message : "Failed to add expense",
      })
    }
  }

  const handleEdit = (item: any) => {
    setEditingExpense(item.id)
    setFormData({
      date: item.date,
      paymentType: item.paymentType,
      amount: item.amount.toString(),
      category: item.category,
    })
    setOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId)
      toast({
        title: "Expense deleted",
        description: "Expense has been deleted successfully",
      })
      setDeleteId(null)
    }
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track your spending</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
              setEditingExpense(null)
              setFormData({
                date: new Date().toISOString().split("T")[0],
                paymentType: "account",
                amount: "",
                category: "shopping",
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
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
                {editingExpense ? "Update Expense" : "Add Expense"}
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
              S/.{" "}
              {expenses
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
              S/.{" "}
              {expenses
                .filter((e) => e.category === "transportation")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Entertainment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              S/.{" "}
              {expenses
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
            {sortedExpenses.slice(0, visibleCount).map((item) => (
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
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold">S/. {item.amount.toFixed(2)}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">

                      {/* Edit */}
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete */}
                      <DropdownMenuItem
                        onClick={() => setDeleteId(item.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {visibleCount < sortedExpenses.length && (
              <div className="pt-2 text-center">
                <Button variant="ghost" size="sm" onClick={() => setVisibleCount((prev) => prev + 5)}>
                  Ver más
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense entry and adjust your bank
              balance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
