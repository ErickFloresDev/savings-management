"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Calendar, Wallet, BriefcaseBusiness, DollarSign, Pencil, Trash2, EllipsisVertical, RefreshCw, TrendingUp, ReceiptText, NotepadText } from "lucide-react"
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function IncomePage() {
  const { income, addIncome, updateIncome, deleteIncome } = useData()
  const [open, setOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const [visibleCount, setVisibleCount] = useState(5)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    incomeType: "account" as "cash" | "account",
    amount: "",
    category: "salary" as "salary" | "other",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingIncome) {
      updateIncome(editingIncome, {
        date: formData.date,
        incomeType: formData.incomeType,
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
      })
      toast({
        title: "Income updated",
        description: "Income has been updated successfully",
      })
      setEditingIncome(null)
    } else {
      addIncome({
        date: formData.date,
        incomeType: formData.incomeType,
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
      })
      toast({
        title: "Income added",
        description: "Income has been added successfully",
      })
    }

    setFormData({
      date: new Date().toISOString().split("T")[0],
      incomeType: "account",
      amount: "",
      category: "salary",
    })
    setOpen(false)
  }

  const handleEdit = (item: any) => {
    setEditingIncome(item.id)
    setFormData({
      date: item.date,
      incomeType: item.incomeType,
      amount: item.amount.toString(),
      category: item.category,
    })
    setOpen(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteIncome(deleteId)
      toast({
        title: "Income deleted",
        description: "Income has been deleted successfully",
      })
      setDeleteId(null)
    }
  }

  const sortedIncome = [...income].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Income</h1>
          <p className="text-sm text-muted-foreground">Track your income sources</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
              setEditingIncome(null)
              setFormData({
                date: new Date().toISOString().split("T")[0],
                incomeType: "account",
                amount: "",
                category: "salary",
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">{editingIncome ? "Edit Income" : "Add Income"}</DialogTitle>
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
                  <SelectTrigger className="text-sm w-full">
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
                  <SelectTrigger className="text-sm w-full">
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
              <Button type="submit" className="w-full text-sm mt-2.5">
                {editingIncome ? "Update Income" : "Add Income"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden lg:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">+S/. {income.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Salary Income</CardTitle>
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              +S/.{" "}
              {income
                .filter((i) => i.category === "salary")
                .reduce((sum, i) => sum + i.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Other Income</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              +S/.{" "}
              {income
                .filter((i) => i.category === "other")
                .reduce((sum, i) => sum + i.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="income" className="border-none">
            <Card className="py-4">
              <AccordionTrigger className="px-6 py-0">
                <div className="flex flex-row justify-between items-center">
                  <TrendingUp  className="h-4 w-4 text-gray-600 mr-2"/>
                  <span className="text-sm text-black font-semibold">Income Summary</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="space-y-4 pt-4">
                  {/* Total Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <Wallet  className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Total Income</span>
                    </div>
                    <span className="text-sm">
                      +S/. {income.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Salary Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <BriefcaseBusiness  className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Salary Income</span>
                    </div>
                    <span className="text-sm">
                      +S/.{" "}
                      {income
                        .filter((i) => i.category === "salary")
                        .reduce((sum, i) => sum + i.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Other Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <RefreshCw  className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Other Income</span>
                    </div>
                    <span className="text-sm">
                      +S/.{" "}
                      {income
                        .filter((i) => i.category === "other")
                        .reduce((sum, i) => sum + i.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>

      <Card>
        <CardHeader className="flex items-center">
            <NotepadText className="h-4 w-4 text-gray-600 mr-1"/>
            <CardTitle className="text-sm lg:text-lg font-semibold lg:font-medium">Income History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedIncome.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="mt-0">
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
                <div className="flex items-center gap-3">
                  <p className="text-sm text-green-600 font-semibold">+S/. {item.amount.toFixed(2)}</p>
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
          </div>

          {visibleCount < sortedIncome.length && (
            <div className="pt-2 text-center">
              <Button variant="ghost" size="sm" onClick={() => setVisibleCount((prev) => prev + 5)}>
                Ver más
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this income entry and adjust your bank balance.
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
