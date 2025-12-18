"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/lib/data-context"
import { DollarSign, TrendingDown, Target, AlertCircle, TrendingUp, Crosshair, Wallet, PiggyBank } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const { income, expenses, savings } = useData()
  const [hasUrl, setHasUrl] = useState(true)

  useEffect(() => {
    const sessionUrl = localStorage.getItem("sessionUrl")
    setHasUrl(!!sessionUrl)
  }, [])

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const activeSavings = savings.filter((s) => s.status === "pending")

  // Funcion Ver mas items
  const [incomeVisible, setIncomeVisible] = useState(3)
  const [expensesVisible, setExpensesVisible] = useState(3)

  // ADD THESE CALCULATIONS
  const totalSavings = savings.reduce((sum, s) => sum + Number(s.currentAmount || 0), 0)
  const currentBalance = totalIncome - totalExpenses - totalSavings

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your finances</p>
      </div>

      {!hasUrl && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No API URL configured. Please click the "Link" button in the navigation bar to enter your Google Apps Script
            URL.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current account</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-600">S/. {currentBalance.toFixed(2)} </div>
            <p className="text-xs text-muted-foreground mt-1">Current money</p>
          </CardContent>
        </Card>

        <Card className="hidden lg:block gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp  className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-green-600">+S/. {totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{income.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="hidden lg:block gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-red-500">-S/. {totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="hidden lg:block gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-orange-600">-S/.{totalSavings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {savings.filter((s) => s.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="income" className="border-none">
            <Card className="py-4">
              <AccordionTrigger className="px-6 py-0">
                <div className="flex flex-row justify-between items-center">
                  <Wallet className="h-4 w-4 text-muted-foreground mr-2"/>
                  <span className="text-sm text-muted-foreground">Total Summary</span>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <CardContent className="space-y-4 pt-4">
                  {/* Total Income */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <TrendingUp  className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Total Income</span>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">
                      +S/. {totalIncome.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Total Expense*/}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <TrendingDown  className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Total Expense</span>
                    </div>
                    <span className="text-sm text-red-500 font-semibold">
                      -S/. {totalExpenses.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-4" />
                  {/* Active Goals */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <PiggyBank className="h-4 w-4 text-muted-foreground mr-2"/>
                      <span className="text-sm text-muted-foreground">Active Goals</span>
                    </div>
                    <span className="text-sm text-sky-600 font-semibold">
                      {activeSavings.length}
                    </span>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {income.length === 0 ? (
                <p className="text-sm text-muted-foreground">No income records yet</p>
              ) : (
                <>
                  {income
                    .slice()
                    .reverse()
                    .slice(0, incomeVisible)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.category}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()} • {item.incomeType}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-green-600">+S/{item.amount.toFixed(2)}</p>
                      </div>
                    ))}

                  {incomeVisible < income.length && (
                    <button
                      onClick={() => setIncomeVisible((prev) => prev + 3)}
                      className="text-xs text-primary hover:underline mt-2"
                    >
                      Ver más
                    </button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expense records yet</p>
              ) : (
                <>
                  {expenses
                    .slice()
                    .reverse()
                    .slice(0, expensesVisible)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.category}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()} • {item.paymentType}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-red-500">-S/{item.amount.toFixed(2)}</p>
                      </div>
                    ))}

                  {expensesVisible < expenses.length && (
                    <button
                      onClick={() => setExpensesVisible((prev) => prev + 3)}
                      className="text-xs text-primary hover:underline mt-2"
                    >
                      Ver más
                    </button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-4">
        <CardHeader className="py-0">
          <CardTitle className="text-base">Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No savings goals yet</p>
          ) : (
            savings.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              return (
                <div key={goal.id} className="space-y-2 pb-2">
                  <div className="flex items-center justify-start">
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{goal.goal}</p>
                      <p className="text-xs text-muted-foreground">
                        {goal.incomeType} • {goal.status}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold">{progress.toFixed(0)}%</p>
                      <p className="text-xs font-medium">
                      S/{Number(goal.currentAmount ?? 0).toFixed(2)} / S/{Number(goal.targetAmount ?? 0).toFixed(2)}
                    </p>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
