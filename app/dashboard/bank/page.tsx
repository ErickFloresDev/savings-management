"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/lib/data-context"
import { DollarSign, TrendingUp, Wallet } from "lucide-react"

export default function BankPage() {
  const { income } = useData()
  const [incomeVisible, setIncomeVisible] = useState(5)

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0)
  const cashIncome = income.filter((i) => i.incomeType === "cash").reduce((sum, i) => sum + i.amount, 0)
  const accountIncome = income.filter((i) => i.incomeType === "account").reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">Bank</h1>
        <p className="text-sm text-muted-foreground">Overview of your income by source</p>
      </div>

      <Card className="bg-gray-50 border-primary/20 gap-0">
        <CardHeader className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base md:text-lg">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">S/. {totalIncome.toFixed(2)}</div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-gray-300 border-t text-sm">
            <div>
              <p className="text-muted-foreground">Cash</p>
              <p className="font-semibold">S/. {cashIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account</p>
              <p className="font-semibold">S/. {accountIncome.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Transactions</p>
              <p className="font-semibold">{income.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gap-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Cash Income</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-semibold">S/. {cashIncome.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {income.filter((i) => i.incomeType === "cash").length} transactions
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Income received in cash for immediate use and daily expenses.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Account Income</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-semibold">S/. {accountIncome.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {income.filter((i) => i.incomeType === "account").length} transactions
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Income deposited to your bank account for savings and larger purchases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Cash</span>
              <span className="font-semibold">
                {totalIncome > 0 ? ((cashIncome / totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: totalIncome > 0 ? `${(cashIncome / totalIncome) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Account</span>
              <span className="font-semibold">
                {totalIncome > 0 ? ((accountIncome / totalIncome) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: totalIncome > 0 ? `${(accountIncome / totalIncome) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Income Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {income.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No income transactions yet</p>
            ) : (
              <>
                {income
                  .slice()
                  .reverse()
                  .slice(0, incomeVisible)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
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
                    onClick={() => setIncomeVisible((prev) => prev + 5)}
                    className="text-xs text-primary hover:underline mt-2 w-full text-center"
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
  )
}
