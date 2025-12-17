"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import initialData from "./data.json"

type IncomeType = "cash" | "account"
type ExpenseCategory = "shopping" | "transportation" | "entertainment"
type IncomeCategory = "salary" | "other"
type SavingsStatus = "pending" | "completed"

export interface Income {
  id: string
  date: string
  incomeType: IncomeType
  amount: number
  category: IncomeCategory
}

export interface Expense {
  id: string
  date: string
  paymentType: IncomeType
  amount: number
  category: ExpenseCategory
}

export interface Savings {
  id: string
  goal: string
  incomeType: IncomeType
  status: SavingsStatus
  targetAmount: number
  currentAmount: number
}

export interface Bank {
  cash: number
  account: number
  savingsPercentage: number
}

export interface DataContextType {
  income: Income[]
  expenses: Expense[]
  savings: Savings[]
  bank: Bank
  addIncome: (income: Omit<Income, "id">) => void
  updateIncome: (id: string, updates: Partial<Omit<Income, "id">>) => void
  deleteIncome: (id: string) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  updateExpense: (id: string, updates: Partial<Omit<Expense, "id">>) => void
  deleteExpense: (id: string) => void
  addSavings: (savings: Omit<Savings, "id">) => void
  updateSavings: (id: string, updates: Partial<Savings>) => void
  deleteSavings: (id: string) => void
  addAmountToGoal: (
    goalId: string,
    amount: number,
    sourceType: "cash" | "account",
  ) => { success: boolean; message: string }
  updateSavingsPercentage: (percentage: number) => void
  updateBank: (type: "cash" | "account", amount: number) => void
  getTotalBalance: () => number
  apiRequest: (method: "GET" | "POST", action?: "create" | "update" | "delete", data?: any) => Promise<void>
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>(initialData.income as Income[])
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses as Expense[])
  const [savings, setSavings] = useState<Savings[]>(initialData.savings as Savings[])
  const [bank, setBank] = useState<Bank>(initialData.bank)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const sessionUrl = localStorage.getItem("sessionUrl")
    if (sessionUrl) {
      apiRequest("GET")
    }
  }, [])

  const apiRequest = async (method: "GET" | "POST", action?: "create" | "update" | "delete", data?: any) => {
    setIsLoading(true)
    try {
      const sessionUrl = localStorage.getItem("sessionUrl")
      if (!sessionUrl) {
        console.log("[v0] No session URL found")
        return
      }

      if (method === "GET") {
        console.log("[v0] GET request - Simulating data fetch")
      } else if (method === "POST") {
        console.log(`[v0] POST request - Action: ${action}`, data)
      }
    } catch (error) {
      console.error("[v0] API Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalBalance = () => {
    return bank.cash + bank.account
  }

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const income = { ...newIncome, id: Date.now().toString() }
    setIncome((prev) => [...prev, income])
    if (income.incomeType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash + income.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account + income.amount }))
    }
    apiRequest("POST", "create", { type: "income", data: income })
  }

  const updateIncome = (id: string, updates: Partial<Omit<Income, "id">>) => {
    const oldIncome = income.find((i) => i.id === id)
    if (!oldIncome) return

    const updatedIncome = { ...oldIncome, ...updates }

    if (updates.amount !== undefined || updates.incomeType !== undefined) {
      if (oldIncome.incomeType === "cash") {
        setBank((prev) => ({ ...prev, cash: prev.cash - oldIncome.amount }))
      } else {
        setBank((prev) => ({ ...prev, account: prev.account - oldIncome.amount }))
      }

      if (updatedIncome.incomeType === "cash") {
        setBank((prev) => ({ ...prev, cash: prev.cash + updatedIncome.amount }))
      } else {
        setBank((prev) => ({ ...prev, account: prev.account + updatedIncome.amount }))
      }
    }

    setIncome((prev) => prev.map((i) => (i.id === id ? updatedIncome : i)))
    apiRequest("POST", "update", { type: "income", id, data: updates })
  }

  const deleteIncome = (id: string) => {
    const incomeToDelete = income.find((i) => i.id === id)
    if (!incomeToDelete) return

    if (incomeToDelete.incomeType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash - incomeToDelete.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account - incomeToDelete.amount }))
    }

    setIncome((prev) => prev.filter((i) => i.id !== id))
    apiRequest("POST", "delete", { type: "income", id })
  }

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const availableInSource = newExpense.paymentType === "cash" ? bank.cash : bank.account

    if (newExpense.amount > availableInSource) {
      throw new Error(`Insufficient funds in ${newExpense.paymentType}. Available: S/. ${availableInSource.toFixed(2)}`)
    }

    const expense = { ...newExpense, id: Date.now().toString() }
    setExpenses((prev) => [...prev, expense])
    if (expense.paymentType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash - expense.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account - expense.amount }))
    }
    apiRequest("POST", "create", { type: "expense", data: expense })
  }

  const updateExpense = (id: string, updates: Partial<Omit<Expense, "id">>) => {
    const oldExpense = expenses.find((e) => e.id === id)
    if (!oldExpense) return

    const updatedExpense = { ...oldExpense, ...updates }

    if (updates.amount !== undefined || updates.paymentType !== undefined) {
      if (oldExpense.paymentType === "cash") {
        setBank((prev) => ({ ...prev, cash: prev.cash + oldExpense.amount }))
      } else {
        setBank((prev) => ({ ...prev, account: prev.account + oldExpense.amount }))
      }

      if (updatedExpense.paymentType === "cash") {
        setBank((prev) => ({ ...prev, cash: prev.cash - updatedExpense.amount }))
      } else {
        setBank((prev) => ({ ...prev, account: prev.account - updatedExpense.amount }))
      }
    }

    setExpenses((prev) => prev.map((e) => (e.id === id ? updatedExpense : e)))
    apiRequest("POST", "update", { type: "expense", id, data: updates })
  }

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find((e) => e.id === id)
    if (!expenseToDelete) return

    if (expenseToDelete.paymentType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash + expenseToDelete.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account + expenseToDelete.amount }))
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id))
    apiRequest("POST", "delete", { type: "expense", id })
  }

  const addSavings = (newSavings: Omit<Savings, "id">) => {
    const availableInSource = newSavings.incomeType === "cash" ? bank.cash : bank.account

    if (newSavings.currentAmount > availableInSource) {
      throw new Error(`Insufficient funds in ${newSavings.incomeType}. Available: S/. ${availableInSource.toFixed(2)}`)
    }

    const savingsWithId = { ...newSavings, id: Date.now().toString() }
    setSavings((prev) => [...prev, savingsWithId])

    if (newSavings.currentAmount > 0) {
      setBank((prev) => ({
        ...prev,
        [newSavings.incomeType]: prev[newSavings.incomeType] - newSavings.currentAmount,
      }))
    }

    apiRequest("POST", "create", { type: "savings", data: savingsWithId })
  }

  const updateSavings = (id: string, updates: Partial<Savings>) => {
    setSavings((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
    apiRequest("POST", "update", { type: "savings", id, data: updates })
  }

  const deleteSavings = (id: string) => {
    const savingsToDelete = savings.find((s) => s.id === id)
    if (!savingsToDelete) return

    // Return the current amount back to the bank
    if (savingsToDelete.currentAmount > 0) {
      setBank((prev) => ({
        ...prev,
        [savingsToDelete.incomeType]: prev[savingsToDelete.incomeType] + savingsToDelete.currentAmount,
      }))
    }

    setSavings((prev) => prev.filter((s) => s.id !== id))
    apiRequest("POST", "delete", { type: "savings", id })
  }

  const addAmountToGoal = (
    goalId: string,
    amount: number,
    sourceType: "cash" | "account",
  ): { success: boolean; message: string } => {
    if (amount <= 0) {
      return { success: false, message: "Amount must be greater than 0" }
    }

    const availableBalance = sourceType === "cash" ? bank.cash : bank.account
    if (amount > availableBalance) {
      return {
        success: false,
        message: `Insufficient funds in ${sourceType}. Available: S/. ${availableBalance.toFixed(2)}`,
      }
    }

    const goal = savings.find((s) => s.id === goalId)
    if (!goal) {
      return { success: false, message: "Goal not found" }
    }

    if (goal.incomeType !== sourceType) {
      return {
        success: false,
        message: `This goal requires funds from ${goal.incomeType}, but you're trying to use ${sourceType}`,
      }
    }

    setBank((prev) => ({
      ...prev,
      [sourceType]: prev[sourceType] - amount,
    }))

    const newAmount = goal.currentAmount + amount
    const newStatus = newAmount >= goal.targetAmount ? "completed" : "pending"
    setSavings((prev) => prev.map((s) => (s.id === goalId ? { ...s, currentAmount: newAmount, status: newStatus } : s)))

    return { success: true, message: "Amount added successfully" }
  }

  const updateSavingsPercentage = (percentage: number) => {
    setBank((prev) => ({ ...prev, savingsPercentage: percentage }))
    apiRequest("POST", "update", { type: "bank", data: { savingsPercentage: percentage } })
  }

  const updateBank = (type: "cash" | "account", amount: number) => {
    setBank((prev) => ({ ...prev, [type]: amount }))
    apiRequest("POST", "update", { type: "bank", data: { [type]: amount } })
  }

  return (
    <DataContext.Provider
      value={{
        income,
        expenses,
        savings,
        bank,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addSavings,
        updateSavings,
        deleteSavings,
        addAmountToGoal,
        updateSavingsPercentage,
        updateBank,
        getTotalBalance,
        apiRequest,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
