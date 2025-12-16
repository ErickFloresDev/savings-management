"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useData } from "@/lib/data-context"
import { Wallet, Building2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function BankPage() {
  const { bank, updateBank } = useData()
  const [openCash, setOpenCash] = useState(false)
  const [openAccount, setOpenAccount] = useState(false)
  const [cashAmount, setCashAmount] = useState("")
  const [accountAmount, setAccountAmount] = useState("")

  const handleUpdateCash = (e: React.FormEvent) => {
    e.preventDefault()
    updateBank("cash", Number.parseFloat(cashAmount))
    setCashAmount("")
    setOpenCash(false)
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    updateBank("account", Number.parseFloat(accountAmount))
    setAccountAmount("")
    setOpenAccount(false)
  }

  const totalBalance = bank.cash + bank.account

  return (
    <div className="container mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold mb-1">Bank</h1>
        <p className="text-sm text-muted-foreground">Manage your cash and account balances</p>
      </div>

      <Card className="bg-gray-100 border-primary/20 gap-0">
        <CardHeader className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base md:text-lg">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">S/. {totalBalance.toFixed(2)}</div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-gray-300 border-t text-sm">
            <div>
              <p className="text-muted-foreground">Cash</p>
              <p className="font-semibold">S/. {bank.cash.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account</p>
              <p className="font-semibold">S/. {bank.account.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gap-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Cash</CardTitle>
              </div>
              <Dialog open={openCash} onOpenChange={setOpenCash}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base">Update Cash Balance</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateCash} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashAmount" className="text-sm">
                        New Amount
                      </Label>
                      <Input
                        id="cashAmount"
                        type="number"
                        step="0.01"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        required
                        className="text-sm"
                        placeholder={bank.cash.toFixed(2)}
                      />
                    </div>
                    <Button type="submit" className="w-full text-sm">
                      Update Cash
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-2xl font-semibold">S/. {bank.cash.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Physical money</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Cash on hand for daily transactions and immediate expenses.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Account</CardTitle>
              </div>
              <Dialog open={openAccount} onOpenChange={setOpenAccount}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base">Update Account Balance</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateAccount} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountAmount" className="text-sm">
                        New Amount
                      </Label>
                      <Input
                        id="accountAmount"
                        type="number"
                        step="0.01"
                        value={accountAmount}
                        onChange={(e) => setAccountAmount(e.target.value)}
                        required
                        className="text-sm"
                        placeholder={bank.account.toFixed(2)}
                      />
                    </div>
                    <Button type="submit" className="w-full text-sm">
                      Update Account
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-2xl font-semibold">S/. {bank.account.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Bank account</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Money stored in your bank account for savings and larger purchases.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Balance Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Cash</span>
              <span className="font-semibold">
                {totalBalance > 0 ? ((bank.cash / totalBalance) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: totalBalance > 0 ? `${(bank.cash / totalBalance) * 100}%` : "0%" }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Account</span>
              <span className="font-semibold">
                {totalBalance > 0 ? ((bank.account / totalBalance) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: totalBalance > 0 ? `${(bank.account / totalBalance) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
