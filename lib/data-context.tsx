"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
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
}

export interface DataContextType {
  income: Income[]
  expenses: Expense[]
  savings: Savings[]
  savingsPercentage: number
  bank: Bank
  addIncome: (income: Omit<Income, "id">) => void
  addExpense: (expense: Omit<Expense, "id">) => void
  addSavings: (savings: Omit<Savings, "id">) => void
  updateSavings: (id: string, updates: Partial<Savings>) => void
  updateSavingsPercentage: (percentage: number) => void
  updateBank: (type: "cash" | "account", amount: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>(initialData.income as Income[])
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses as Expense[])
  const [savings, setSavings] = useState<Savings[]>(initialData.savings as Savings[])
  const [savingsPercentage, setSavingsPercentage] = useState(initialData.savingsPercentage)
  const [bank, setBank] = useState<Bank>(initialData.bank)

  const addIncome = (newIncome: Omit<Income, "id">) => {
    const income = { ...newIncome, id: Date.now().toString() }
    setIncome((prev) => [...prev, income])
    // Update bank balance
    if (income.incomeType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash + income.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account + income.amount }))
    }
  }

  const addExpense = (newExpense: Omit<Expense, "id">) => {
    const expense = { ...newExpense, id: Date.now().toString() }
    setExpenses((prev) => [...prev, expense])
    // Update bank balance
    if (expense.paymentType === "cash") {
      setBank((prev) => ({ ...prev, cash: prev.cash - expense.amount }))
    } else {
      setBank((prev) => ({ ...prev, account: prev.account - expense.amount }))
    }
  }

  const addSavings = (newSavings: Omit<Savings, "id">) => {
    setSavings((prev) => [...prev, { ...newSavings, id: Date.now().toString() }])
  }

  const updateSavings = (id: string, updates: Partial<Savings>) => {
    setSavings((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  const updateSavingsPercentage = (percentage: number) => {
    setSavingsPercentage(percentage)
  }

  const updateBank = (type: "cash" | "account", amount: number) => {
    setBank((prev) => ({ ...prev, [type]: amount }))
  }

  return (
    <DataContext.Provider
      value={{
        income,
        expenses,
        savings,
        savingsPercentage,
        bank,
        addIncome,
        addExpense,
        addSavings,
        updateSavings,
        updateSavingsPercentage,
        updateBank,
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
