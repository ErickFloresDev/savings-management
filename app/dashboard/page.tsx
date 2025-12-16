"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/lib/data-context"
import { DollarSign, TrendingDown, Target, Wallet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"


export default function DashboardPage() {
  const { income, expenses, savings, bank } = useData()

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBalance = bank.cash + bank.account
  const activeSavings = savings.filter((s) => s.status === "pending")

  // Funcion Ver mas items
  const [incomeVisible, setIncomeVisible] = useState(3)
  const [expensesVisible, setExpensesVisible] = useState(3)


  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your finances</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{income.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">S/. {totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cash: S/. {bank.cash} | Account: S/. {bank.account}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{activeSavings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {savings.filter((s) => s.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                    <p className="text-sm font-semibold text-foreground">+S/{item.amount.toFixed(2)}</p>
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

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
                    <p className="text-sm font-semibold text-foreground">-S/{item.amount.toFixed(2)}</p>
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

            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savings.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{goal.goal}</p>
                    <p className="text-xs text-muted-foreground">
                      {goal.incomeType} • {goal.status}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    S/{goal.currentAmount} / S/{goal.targetAmount}
                  </p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
