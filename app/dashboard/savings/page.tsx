"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Target, TrendingUp, CheckCircle2, CheckCircle, Clock, Settings, Pencil, Trash2, EllipsisVertical, RotateCcw, CircleCheckBig, PiggyBank, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function SavingsPage() {
  const { savings, income, expenses, addSavings, updateSavings, deleteSavings, addAmountToGoal } = useData()
  const { toast } = useToast()
  const [openGoal, setOpenGoal] = useState(false)
  const [editGoal, setEditGoal] = useState<string | null>(null)
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null)

  const [goalFormData, setGoalFormData] = useState({
    goal: "",
    incomeType: "account" as "cash" | "account",
    targetAmount: "",
    currentAmount: "",
  })

  // Calcular balances disponibles
  const balances = useMemo(() => {
    const calculateBalance = (type: "cash" | "account") => {
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
    
    const cash = calculateBalance("cash")
    const account = calculateBalance("account")
    
    return {
      cash,
      account,
    }
  }, [income, expenses, savings])

  const handleEditClick = (goal: (typeof savings)[0]) => {
    setGoalFormData({
      goal: goal.goal,
      incomeType: goal.incomeType,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
    })
    setEditGoal(goal.id)
  }

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const currentAmount = Number.parseFloat(goalFormData.currentAmount)
      const targetAmount = Number.parseFloat(goalFormData.targetAmount)

      // Validar que hay fondos disponibles
      const availableBalance = goalFormData.incomeType === "cash" ? balances.cash : balances.account
      if (currentAmount > availableBalance) {
        toast({
          title: "Error",
          description: `Insufficient funds in ${goalFormData.incomeType}. Available: S/. ${availableBalance.toFixed(2)}`,
          variant: "destructive",
        })
        return
      }

      addSavings({
        goal: goalFormData.goal,
        incomeType: goalFormData.incomeType,
        status: currentAmount >= targetAmount ? "completed" : "pending",
        targetAmount: targetAmount,
        currentAmount: currentAmount,
      })

      setGoalFormData({
        goal: "",
        incomeType: "account",
        targetAmount: "",
        currentAmount: "",
      })
      setOpenGoal(false)

      toast({
        title: "Success",
        description: `Goal "${goalFormData.goal}" created successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create goal",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editGoal) return

    const currentAmount = Number.parseFloat(goalFormData.currentAmount)
    const targetAmount = Number.parseFloat(goalFormData.targetAmount)

    updateSavings(editGoal, {
      goal: goalFormData.goal,
      incomeType: goalFormData.incomeType,
      targetAmount: targetAmount,
      currentAmount: currentAmount,
      status: currentAmount >= targetAmount ? "completed" : "pending",
    })

    setGoalFormData({
      goal: "",
      incomeType: "account",
      targetAmount: "",
      currentAmount: "",
    })
    setEditGoal(null)

    toast({
      title: "Success",
      description: "Goal updated successfully",
    })
  }

  const handleDeleteGoal = () => {
    if (!deleteGoalId) return

    const goalToDelete = savings.find((s) => s.id === deleteGoalId)
    deleteSavings(deleteGoalId)
    setDeleteGoalId(null)

    toast({
      title: "Success",
      description: `Goal "${goalToDelete?.goal}" deleted successfully`,
    })
  }

  const handleToggleStatus = (id: string, currentStatus: "pending" | "completed") => {
    updateSavings(id, { status: currentStatus === "pending" ? "completed" : "pending" })
  }

  const handleUpdateAmount = async (
    id: string,
    amount: number,
    goal: (typeof savings)[0]
  ) => {
    const result = await addAmountToGoal(id, amount, goal.incomeType)

    if (result.success) {
      toast({
        title: "Success",
        description: `S/. ${amount.toFixed(2)} added to ${goal.goal}`,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
      })
    }
  }

  const totalSaved = savings.reduce((sum, s) => sum + s.currentAmount, 0)
  const totalTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0)
  const completedGoals = savings.filter((s) => s.status === "completed").length

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Manage your savings targets</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">

            {/* ================= ADD GOAL DIALOG ================= */}
            <Dialog open={openGoal} onOpenChange={setOpenGoal}>
              <DialogTrigger asChild>
                <Button size="sm" className="hidden md:flex gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">Add Savings Goal</DialogTitle>
                  <DialogDescription className="text-sm">
                    Create a new goal to track your savings progress.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal" className="text-sm">
                      Goal Name
                    </Label>
                    <Input
                      id="goal"
                      type="text"
                      value={goalFormData.goal}
                      onChange={(e) => setGoalFormData({ ...goalFormData, goal: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incomeType" className="text-sm">
                      Income Type
                    </Label>
                    <Select
                      value={goalFormData.incomeType}
                      onValueChange={(value: "cash" | "account") =>
                        setGoalFormData({ ...goalFormData, incomeType: value })
                      }
                    >
                      <SelectTrigger className="text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAmount" className="text-sm">
                      Target Amount
                    </Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      value={goalFormData.targetAmount}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          targetAmount: e.target.value,
                        })
                      }
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAmount" className="text-sm">
                      Current Amount
                    </Label>
                    <div className="text-xs text-muted-foreground mb-1">
                      Available in {goalFormData.incomeType}: S/.{" "}
                      {(goalFormData.incomeType === "cash" ? balances.cash : balances.account).toFixed(2)}
                    </div>
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      max={goalFormData.incomeType === "cash" ? balances.cash : balances.account}
                      value={goalFormData.currentAmount}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          currentAmount: e.target.value,
                        })
                      }
                      required
                      className="text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full text-sm mt-2.5">
                    Add Goal
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={editGoal !== null} onOpenChange={(open) => !open && setEditGoal(null)}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">Edit Savings Goal</DialogTitle>
                  <DialogDescription className="text-sm">Update your savings goal details.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdateGoal} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-goal" className="text-sm">
                      Goal Name
                    </Label>
                    <Input
                      id="edit-goal"
                      type="text"
                      value={goalFormData.goal}
                      onChange={(e) => setGoalFormData({ ...goalFormData, goal: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-incomeType" className="text-sm">
                      Income Type
                    </Label>
                    <Select
                      value={goalFormData.incomeType}
                      onValueChange={(value: "cash" | "account") =>
                        setGoalFormData({ ...goalFormData, incomeType: value })
                      }
                    >
                      <SelectTrigger className="text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-targetAmount" className="text-sm">
                      Target Amount
                    </Label>
                    <Input
                      id="edit-targetAmount"
                      type="number"
                      step="0.01"
                      value={goalFormData.targetAmount}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          targetAmount: e.target.value,
                        })
                      }
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-currentAmount" className="text-sm">
                      Current Amount
                    </Label>
                    <Input
                      id="edit-currentAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={goalFormData.currentAmount}
                      onChange={(e) =>
                        setGoalFormData({
                          ...goalFormData,
                          currentAmount: e.target.value,
                        })
                      }
                      required
                      className="text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full text-sm mt-2.5">
                    Update Goal
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog open={deleteGoalId !== null} onOpenChange={(open) => !open && setDeleteGoalId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete the goal and return the saved amount back to your bank.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteGoal}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* ================= MOBILE DROPDOWN ================= */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpenGoal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {Number(totalSaved).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">of S/. {totalTarget.toFixed(2)} target</p>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Goals</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{completedGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">of {savings.length} goals</p>
          </CardContent>
        </Card>
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">
              {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">towards all goals</p>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="income" className="border-none">
            <Card className="py-4">
              <AccordionTrigger className="px-6 py-0">
                <div className="flex flex-row justify-between items-center">
                  <PiggyBank className="h-4 w-4 text-gray-600 mr-2"/>
                  <span className="text-sm text-black font-semibold">Savings Summary</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="space-y-4 pt-4">
                  {/* Total Saved */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <DollarSign className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Total Saved</span>
                    </div>
                    <span className="text-sm">
                      S/. {Number(totalSaved).toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Completed Goals */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <CircleCheckBig className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Completed Goals</span>
                    </div>
                    <span className="text-sm">
                      {completedGoals}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Overall Progress */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <TrendingUp className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Overall Progress</span>
                    </div>
                    <span className="text-sm">
                      {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="grid gap-4">
        {savings.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const availableBalance = goal.incomeType === "cash" ? balances.cash : balances.account

          return (
            <Card key={goal.id}>
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base md:text-lg font-semibold line-clamp-1">{goal.goal}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {goal.incomeType} •
                      {goal.status === "completed" ? (
                        <span className="text-green-500 flex items-center ml-1">
                          {goal.status} <CheckCircle className="h-3 w-3 ml-1" />
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center ml-1">
                          {goal.status} <Clock className="h-3 w-3 ml-1" />
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground flex items-center">
                      Available: S/. {availableBalance.toFixed(2)}
                    </p>
                  </div>

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

                    <DropdownMenuContent align="end" className="w-40">
                      {/* Edit */}
                      <DropdownMenuItem onClick={() => handleEditClick(goal)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      {/* Complete / Reopen */}
                      <DropdownMenuItem
                        onClick={() => handleToggleStatus(goal.id, goal.status)}
                      >
                        {goal.status === "completed" ? (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reopen
                          </>
                        ) : (
                          <>
                            <CircleCheckBig className="mr-2 h-4 w-4" />
                            Complete
                          </>
                        )}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {/* Delete */}
                      <DropdownMenuItem
                        onClick={() => setDeleteGoalId(goal.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">
                      S/. {Number(goal.currentAmount ?? 0).toFixed(2)} - S/. {Number(goal.targetAmount ?? 0).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold">{progress.toFixed(0)}%</p>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                {goal.status === "pending" && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max={availableBalance}
                      placeholder="Add amount"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const input = e.currentTarget
                          const value = Number.parseFloat(input.value)
                          if (value > 0) {
                            handleUpdateAmount(goal.id, value, goal)
                            input.value = ""
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        const value = Number.parseFloat(input.value)
                        if (value > 0) {
                          handleUpdateAmount(goal.id, value, goal)
                          input.value = ""
                        }
                      }}
                      className="text-xs"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}