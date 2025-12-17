"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import {
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  CheckCircle,
  Clock,
  Settings,
  Percent,
  Pencil,
  Trash2,
  ChevronDown,
  EllipsisVertical,
  RotateCcw,
  CircleCheckBig,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SavingsPage() {
  const { savings, bank, addSavings, updateSavings, deleteSavings, addAmountToGoal, updateSavingsPercentage } =
    useData()
  const { toast } = useToast()
  const [openGoal, setOpenGoal] = useState(false)
  const [openPercentage, setOpenPercentage] = useState(false)
  const [editGoal, setEditGoal] = useState<string | null>(null)
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null)

  const [goalFormData, setGoalFormData] = useState({
    goal: "",
    incomeType: "account" as "cash" | "account",
    targetAmount: "",
    currentAmount: "",
  })
  const [percentageValue, setPercentageValue] = useState(bank.savingsPercentage.toString())

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

  const handleUpdatePercentage = (e: React.FormEvent) => {
    e.preventDefault()
    updateSavingsPercentage(Number.parseFloat(percentageValue))
    setOpenPercentage(false)

    toast({
      title: "Success",
      description: `Savings percentage updated to ${percentageValue}%`,
    })
  }

  const handleToggleStatus = (id: string, currentStatus: "pending" | "completed") => {
    updateSavings(id, { status: currentStatus === "pending" ? "completed" : "pending" })
  }

  const handleUpdateAmount = (id: string, amount: number, goal: (typeof savings)[0]) => {
    const result = addAmountToGoal(id, amount, goal.incomeType)

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
            {/* ================= SET % DIALOG ================= */}
            <Dialog open={openPercentage} onOpenChange={setOpenPercentage}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-sm bg-transparent">
                  <Percent className="h-4 w-4" />
                  Percent
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">Update Savings Percentage</DialogTitle>
                  <DialogDescription className="text-sm">
                    Set the percentage of your income that will be saved automatically.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUpdatePercentage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-sm">
                      Percentage
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={percentageValue}
                      onChange={(e) => setPercentageValue(e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full text-sm">
                    Update Percentage
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

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
                      <SelectTrigger className="text-sm">
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
                      {(goalFormData.incomeType === "cash" ? bank.cash : bank.account).toFixed(2)} | Total: S/.{" "}
                      {(bank.cash + bank.account).toFixed(2)}
                    </div>
                    <Input
                      id="currentAmount"
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

                  <Button type="submit" className="w-full text-sm">
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
                      <SelectTrigger className="text-sm">
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

                  <Button type="submit" className="w-full text-sm">
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
                  <DropdownMenuItem onClick={() => setOpenPercentage(true)}>
                    <Percent className="h-4 w-4 mr-2" />
                    Percent
                  </DropdownMenuItem>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {totalSaved.toFixed(2)}</div>
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
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{bank.savingsPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">of income</p>
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="bank-balance" className="border-none">

          <Card className="bg-white py-4">

            {/* HEADER (Trigger) */}
            <AccordionTrigger className="px-4 py-0 hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Bank Balance
                </span>
              </div>
            </AccordionTrigger>

            {/* CONTENT */}
            <AccordionContent>
              <CardContent className="space-y-0 pt-0">

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card className="rounded-lg border p-3 gap-2 text-center justify-center">
                    <p className="text-xs text-muted-foreground">Cash</p>
                    <p className="font-medium">
                      S/. {bank.cash.toFixed(2)}
                    </p>
                  </Card>

                  <Card className="rounded-lg border p-3 gap-2 text-center justify-center">
                    <p className="text-xs text-muted-foreground">Account</p>
                    <p className="font-medium">
                      S/. {bank.account.toFixed(2)}
                    </p>
                  </Card>

                  <Card className="rounded-lg border p-3 gap-2 text-center justify-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">
                      S/. {(bank.cash + bank.account).toFixed(2)}
                    </p>
                  </Card>
                </div>

              </CardContent>
            </AccordionContent>

          </Card>
        </AccordionItem>
      </Accordion>


      <div className="grid gap-4">
        {savings.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const availableBalance = goal.incomeType === "cash" ? bank.cash : bank.account

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
                      S/. {goal.currentAmount.toFixed(2)} / S/. {goal.targetAmount.toFixed(2)}
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
