"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/lib/data-context"
import { Plus, Target, TrendingUp, CheckCircle2, CheckCircle, Clock, Settings, Percent } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SavingsPage() {
  const { savings, savingsPercentage, addSavings, updateSavings, updateSavingsPercentage } = useData()
  const [openGoal, setOpenGoal] = useState(false)
  const [openPercentage, setOpenPercentage] = useState(false)
  const [goalFormData, setGoalFormData] = useState({
    goal: "",
    incomeType: "account" as "cash" | "account",
    targetAmount: "",
    currentAmount: "",
  })
  const [percentageValue, setPercentageValue] = useState(savingsPercentage.toString())

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    addSavings({
      goal: goalFormData.goal,
      incomeType: goalFormData.incomeType,
      status: "pending",
      targetAmount: Number.parseFloat(goalFormData.targetAmount),
      currentAmount: Number.parseFloat(goalFormData.currentAmount),
    })
    setGoalFormData({
      goal: "",
      incomeType: "account",
      targetAmount: "",
      currentAmount: "",
    })
    setOpenGoal(false)
  }

  const handleUpdatePercentage = (e: React.FormEvent) => {
    e.preventDefault()
    updateSavingsPercentage(Number.parseFloat(percentageValue))
    setOpenPercentage(false)
  }

  const handleToggleStatus = (id: string, currentStatus: "pending" | "completed") => {
    updateSavings(id, { status: currentStatus === "pending" ? "completed" : "pending" })
  }

  const handleUpdateAmount = (id: string, amount: number) => {
    const goal = savings.find((s) => s.id === id)
    if (goal) {
      const newAmount = goal.currentAmount + amount
      const newStatus = newAmount >= goal.targetAmount ? "completed" : "pending"
      updateSavings(id, { currentAmount: newAmount, status: newStatus })
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
                {/* Desktop */}
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex gap-2 text-sm bg-transparent"
                >
                  <Percent className="h-4 w-4" />
                  Percent
                </Button>

              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">
                    Update Savings Percentage
                  </DialogTitle>
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
                {/* Desktop */}
                <Button
                  size="sm"
                  className="hidden md:flex gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base">
                    Add Savings Goal
                  </DialogTitle>
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
                      onChange={(e) =>
                        setGoalFormData({ ...goalFormData, goal: e.target.value })
                      }
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
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
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
                    <Percent  className="h-4 w-4 mr-2" />
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
            <div className="text-xl font-semibold">{savingsPercentage}%</div>
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

      <div className="grid gap-4">
        {savings.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          return (
            <Card key={goal.id}>
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base md:text-lg font-semibold line-clamp-1">{goal.goal}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {goal.incomeType} •
                      {goal.status === 'completed' ? (
                        <span className="text-green-500 flex items-center ml-1">
                          {goal.status} <CheckCircle className="h-3 w-3 ml-1" />
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center ml-1">
                          {goal.status} <Clock className="h-3 w-3 ml-1" />
                        </span>
                      )}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(goal.id, goal.status)}
                    className="text-xs"
                  >
                    {goal.status === "completed" ? "Reopen" : "Complete"}
                  </Button>
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
                      placeholder="Add amount"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          const input = e.currentTarget
                          const value = Number.parseFloat(input.value)
                          if (value > 0) {
                            handleUpdateAmount(goal.id, value)
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
                          handleUpdateAmount(goal.id, value)
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
