"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as api from "./api"

type IncomeType = "efectivo" | "cuenta"
type IncomeCategory = "salario" | "otros"
type SavingsStatus = "pendiente" | "completado"

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
  category: string
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
  efectivo: number
  cuenta: number
  savingsPercentage: number
}

export interface DataContextType {
  income: Income[]
  expenses: Expense[]
  savings: Savings[]
  bank: Bank
  addIncome: (income: Omit<Income, "id">) => Promise<void>
  updateIncome: (id: string, updates: Partial<Omit<Income, "id">>) => Promise<void>
  deleteIncome: (id: string) => Promise<void>
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>
  updateExpense: (id: string, updates: Partial<Omit<Expense, "id">>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addSavings: (savings: Omit<Savings, "id">) => Promise<void>
  updateSavings: (id: string, updates: Partial<Savings>) => Promise<void>
  deleteSavings: (id: string) => Promise<void>
  addAmountToGoal: (
    goalId: string,
    amount: number,
    sourceType: "efectivo" | "cuenta",
  ) => Promise<{ success: boolean; message: string }>
  updateSavingsPercentage: (percentage: number) => Promise<void>
  updateBank: (type: "efectivo" | "cuenta", amount: number) => Promise<void>
  getTotalBalance: () => number
  apiRequest: () => Promise<void>
  isLoading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [savings, setSavings] = useState<Savings[]>([])
  const [bank, setBank] = useState<Bank>({ efectivo: 0, cuenta: 0, savingsPercentage: 10 })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const sessionUrl = localStorage.getItem("sessionUrl")
    if (sessionUrl) {
      loadAllData()
    }
  }, [])

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const [incomeData, expensesData, savingsData, bankData] = await Promise.all([
        api.fetchIncome(),
        api.fetchExpenses(),
        api.fetchSavings(),
        api.fetchBank(),
      ])

      setIncome(
        incomeData.map((item) => ({
          id: item.id,
          date: item.date,
          incomeType: item.income_type,
          amount: item.amount,
          category: item.category,
        })),
      )

      setExpenses(
        expensesData.map((item) => ({
          id: item.id,
          date: item.date,
          paymentType: item.payment_type,
          amount: item.amount,
          category: item.category,
        })),
      )

      setSavings(
        savingsData.map((item) => ({
          id: item.id,
          goal: item.goal,
          incomeType: item.income_type,
          status: item.status,
          targetAmount: item.target_amount,
          currentAmount: item.current_amount,
        })),
      )

      if (bankData) {
        setBank({
          efectivo: bankData.efectivo,
          cuenta: bankData.cuenta,
          savingsPercentage: bankData.savings_percentage,
        })
      }
    } catch (error) {
      //console.error("[v0] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalBalance = () => {
    return bank.efectivo + bank.cuenta
  }

  const addIncome = async (newIncome: Omit<Income, "id">) => {
    const apiIncome = {
      date: newIncome.date,
      income_type: newIncome.incomeType,
      amount: newIncome.amount,
      category: newIncome.category,
    }

    const success = await api.createIncome(apiIncome)
    if (success) {
      await loadAllData()
    }
  }

  const updateIncome = async (id: string, updates: Partial<Omit<Income, "id">>) => {
    const oldIncome = income.find((i) => i.id === id)
    if (!oldIncome) return

    const updatedIncome = { ...oldIncome, ...updates }
    const apiIncome = {
      id: updatedIncome.id,
      date: updatedIncome.date,
      income_type: updatedIncome.incomeType,
      amount: updatedIncome.amount,
      category: updatedIncome.category,
    }

    const success = await api.updateIncome(apiIncome)
    if (success) {
      await loadAllData()
    }
  }

  const deleteIncome = async (id: string) => {
    const success = await api.deleteIncome(id)
    if (success) {
      await loadAllData()
    }
  }

  const addExpense = async (newExpense: Omit<Expense, "id">) => {

    const apiExpense = {
      date: newExpense.date,
      payment_type: newExpense.paymentType,
      amount: newExpense.amount,
      category: newExpense.category,
    }

    //console.log("[v0] Creating expense:", apiExpense)
    //console.log("[v0] Balance before expense - Efectivo:", bank.efectivo, "Cuenta:", bank.cuenta)

    const success = await api.createExpense(apiExpense)
    if (success) {
      await loadAllData()
      //console.log("[v0] Balance after expense - Efectivo:", bank.efectivo, "Cuenta:", bank.cuenta)
    }
  }

  const updateExpense = async (id: string, updates: Partial<Omit<Expense, "id">>) => {
    const oldExpense = expenses.find((e) => e.id === id)
    if (!oldExpense) return

    const updatedExpense = { ...oldExpense, ...updates }
    const apiExpense = {
      id: updatedExpense.id,
      date: updatedExpense.date,
      payment_type: updatedExpense.paymentType,
      amount: updatedExpense.amount,
      category: updatedExpense.category,
    }

    const success = await api.updateExpense(apiExpense)
    if (success) {
      await loadAllData()
    }
  }

  const deleteExpense = async (id: string) => {
    const success = await api.deleteExpense(id)
    if (success) {
      await loadAllData()
    }
  }

  const addSavings = async (newSavings: Omit<Savings, "id">) => {
    const apiSaving = {
      goal: newSavings.goal,
      income_type: newSavings.incomeType,
      status: newSavings.status,
      target_amount: newSavings.targetAmount,
      current_amount: newSavings.currentAmount,
    }

    const success = await api.createSaving(apiSaving)
    if (success) {
      await loadAllData()
    }
  }

  const updateSavings = async (id: string, updates: Partial<Savings>) => {
    const oldSaving = savings.find((s) => s.id === id)
    if (!oldSaving) return

    const updatedSaving = { ...oldSaving, ...updates }
    const apiSaving = {
      id: updatedSaving.id,
      goal: updatedSaving.goal,
      income_type: updatedSaving.incomeType,
      status: updatedSaving.status,
      target_amount: updatedSaving.targetAmount,
      current_amount: updatedSaving.currentAmount,
    }

    const success = await api.updateSaving(apiSaving)
    if (success) {
      await loadAllData()
    }
  }

  const deleteSavings = async (id: string) => {
    const success = await api.deleteSaving(id)
    if (success) {
      await loadAllData()
    }
  }

  const addAmountToGoal = async (
    goalId: string,
    amount: number,
    sourceType: "efectivo" | "cuenta",
  ): Promise<{ success: boolean; message: string }> => {
    if (amount <= 0) {
      return { success: false, message: "Amount must be greater than 0" }
    }

    // Calcular balance disponible en tiempo real
    const calculateAvailableBalance = (type: "efectivo" | "cuenta") => {
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

    const availableBalance = calculateAvailableBalance(sourceType)
    
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

    const newAmount = goal.currentAmount + amount
    const newStatus = newAmount >= goal.targetAmount ? "completado" : "pendiente"

    await updateSavings(goalId, { currentAmount: newAmount, status: newStatus as SavingsStatus })

    return { success: true, message: "Amount added successfully" }
  }

  const updateSavingsPercentage = async (percentage: number) => {
    const apiBank = {
      id: "SAVE",
      efectivo: bank.efectivo,
      cuenta: bank.cuenta,
      savings_percentage: percentage,
    }

    const success = await api.updateBank(apiBank)
    if (success) {
      await loadAllData()
    }
  }

  const updateBank = async (type: "efectivo" | "cuenta", amount: number) => {
    const apiBank = {
      id: "SAVE",
      efectivo: type === "efectivo" ? amount : bank.efectivo,
      cuenta: type === "cuenta" ? amount : bank.cuenta,
      savings_percentage: bank.savingsPercentage,
    }

    const success = await api.updateBank(apiBank)
    if (success) {
      await loadAllData()
    }
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
        apiRequest: loadAllData,
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
