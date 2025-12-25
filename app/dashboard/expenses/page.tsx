"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Calendar, HandCoins, ShoppingCart, Car, Pencil, Trash2, EllipsisVertical, TrendingDown, Wallet, TvMinimalPlay, NotepadText, DollarSign, CirclePlus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

export default function ExpensesPage() {
  const { expenses, income, savings, addExpense, updateExpense, deleteExpense } = useData()
  const [open, setOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  const [visibleCount, setVisibleCount] = useState(5)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    paymentType: "cuenta" as "efectivo" | "cuenta",
    amount: "",
    category: "shopping" as "shopping" | "transportation" | "entertainment",
  })

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalSavings = savings.reduce((sum, s) => sum + Number(s.currentAmount || 0), 0)
  const currentBalance = totalIncome - totalExpenses - totalSavings

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
        paymentType: "cuenta",
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

  // Agregar este useMemo después de tus estados, similar a savings page
  const balances = useMemo(() => {
    const calculateBalance = (type: "efectivo" | "cuenta") => {
      const totalIncome = income
        .filter(i => i.incomeType === type)
        .reduce((sum, i) => sum + i.amount, 0)
      
      const totalExpenses = expenses
        .filter(e => e.paymentType === type)
        .reduce((sum, e) => sum + e.amount, 0)
      
      const totalSavings = savings
        .filter(s => s.incomeType === type)
        .reduce((sum, s) => sum + s.currentAmount, 0)
      
      return totalIncome - totalExpenses - totalSavings
    }
    
    const efectivo = calculateBalance("efectivo")
    const cuenta = calculateBalance("cuenta")
    
    return {
      efectivo,
      cuenta
    }
  }, [income, expenses, savings])

  // Agregar esta validación en handleSubmit, antes de addExpense o updateExpense
  const amount = Number.parseFloat(formData.amount)
  const availableBalance = formData.paymentType === "efectivo" ? balances.efectivo : balances.cuenta

  if (amount > availableBalance) {
    toast({
      title: "Error",
      description: `Insufficient funds in ${formData.paymentType}. Available: S/. ${availableBalance.toFixed(2)}`,
      variant: "destructive",
    })
    return
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Gestión de Gastos</h1>
          <p className="text-sm text-muted-foreground">Realice un seguimiento de sus gastos</p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) {
              setEditingExpense(null)
              setFormData({
                date: new Date().toISOString().split("T")[0],
                paymentType: "cuenta",
                amount: "",
                category: "shopping",
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="hidden md:flex gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Registrar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base text-center">{editingExpense ? "Editar Gasto" : "Agregar Gasto"}</DialogTitle>
              <DialogDescription className="text-sm text-center">
                Gestiona tus gastos de manera correcta.
              </DialogDescription>
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
                  onValueChange={(value: "efectivo" | "cuenta") => setFormData({ ...formData, paymentType: value })}
                >
                  <SelectTrigger className="text-sm w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo" className="text-sm">
                      Efectivo
                    </SelectItem>
                    <SelectItem value="cuenta" className="text-sm">
                      Cuenta
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm">
                  Amount
                </Label>
                <div className="text-xs text-muted-foreground mb-1">
                  Available in {formData.paymentType}: S/.{" "}
                  {(formData.paymentType === "efectivo" ? balances.efectivo : balances.cuenta).toFixed(2)}
                </div>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={formData.paymentType === "efectivo" ? balances.efectivo : balances.cuenta}
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
                  <SelectTrigger className="text-sm w-full">
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
              <Button type="submit" className="w-full text-sm mt-2.5">
                {editingExpense ? "Update Expense" : "Add Expense"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="hidden lg:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">-S/. {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              -S/.{" "}
              {expenses
                .filter((e) => e.category === "shopping")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transporte</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              -S/.{" "}
              {expenses
                .filter((e) => e.category === "transportation")
                .reduce((sum, e) => sum + e.amount, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Entretenimiento</CardTitle>
            <TvMinimalPlay className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              -S/.{" "}
              {expenses
                .filter((e) => e.category === "entertainment")
                .reduce((sum, e) => sum + e.amount, 0)
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
                  <TrendingDown className="h-4 w-4 text-gray-600 mr-2" />
                  <span className="text-sm text-black font-semibold">Resumen de Gatos</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="space-y-4 pt-4">
                  {/* Current cuenta */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Saldo Actual</span>
                    </div>
                    <span className="text-sm">
                      +S/. {currentBalance.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />

                  {/* Total Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <HandCoins className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Gastos Totales</span>
                    </div>
                    <span className="text-sm">
                      -S/. {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Salario Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Compras</span>
                    </div>
                    <span className="text-sm">
                      -S/.{" "}
                      {expenses
                        .filter((e) => e.category === "shopping")
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Otros Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <Car className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Transporte</span>
                    </div>
                    <span className="text-sm">
                      -S/.{" "}
                      {expenses
                        .filter((e) => e.category === "transportation")
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Otros Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <TvMinimalPlay className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">Entretenimiento</span>
                    </div>
                    <span className="text-sm">
                      -S/.{" "}
                      {expenses
                        .filter((e) => e.category === "entertainment")
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="md:hidden flex items-center justify-end">
        <Button variant="outline"  onClick={() => setOpen(true)}>
          <CirclePlus className="h-4 w-4" />
          Registrar Gasto
        </Button>
      </div>

      <Card>
        <CardHeader className="flex items-center">
          <NotepadText className="h-4 w-4 text-gray-600 mr-1" />
          <CardTitle className="text-base lg:text-lg font-semibold lg:font-medium">Historial de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedExpenses.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
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
                  <p className="text-sm font-semibold text-red-500">-S/. {item.amount.toFixed(2)}</p>
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
