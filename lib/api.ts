const API_BASE_URL = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : null

export interface ApiResponse<T> {
  success: boolean
  data: T
}

// Type mappings between frontend and API
export interface ApiIncome {
  id: string
  date: string
  income_type: "cash" | "account"
  amount: number
  category: "salary" | "other"
}

export interface ApiExpense {
  id: string
  date: string
  payment_type: "cash" | "account"
  amount: number
  category: "shopping" | "transportation" | "entertainment"
}

export interface ApiSaving {
  id: string
  goal: string
  income_type: "cash" | "account"
  status: "pending" | "completed"
  target_amount: number
  current_amount: number
}

export interface ApiBank {
  id: string
  cash: number
  account: number
  savings_percentage: number
}

// Helper function to build API URL
function buildApiUrl(route: string): string {
  const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
  if (!baseUrl) throw new Error("No API URL configured")
  return `${baseUrl}?ruta=${route}`
}

// GET requests
export async function fetchIncome(): Promise<ApiIncome[]> {
  try {
    const response = await fetch(buildApiUrl("api/v1/income"), {
      method: "GET",
    })
    const data: ApiResponse<ApiIncome[]> = await response.json()
    //console.log("[v0] Fetched income:", data)
    return data.success ? data.data : []
  } catch (error) {
    //console.error("[v0] Error fetching income:", error)
    return []
  }
}

export async function fetchExpenses(): Promise<ApiExpense[]> {
  try {
    const response = await fetch(buildApiUrl("api/v1/expense"), {
      method: "GET",
    })
    const data: ApiResponse<ApiExpense[]> = await response.json()
    //console.log("[v0] Fetched expenses:", data)
    return data.success ? data.data : []
  } catch (error) {
    //console.error("[v0] Error fetching expenses:", error)
    return []
  }
}

export async function fetchSavings(): Promise<ApiSaving[]> {
  try {
    const response = await fetch(buildApiUrl("api/v1/saving"), {
      method: "GET",
    })
    const data: ApiResponse<ApiSaving[]> = await response.json()
    //console.log("[v0] Fetched savings:", data)
    return data.success ? data.data : []
  } catch (error) {
    //console.error("[v0] Error fetching savings:", error)
    return []
  }
}

export async function fetchBank(): Promise<ApiBank | null> {
  try {
    const response = await fetch(buildApiUrl("api/v1/bank"), {
      method: "GET",
    })
    const data: ApiResponse<ApiBank[]> = await response.json()
    //console.log("[v0] Fetched bank:", data)
    return data.success && data.data.length > 0 ? data.data[0] : null
  } catch (error) {
    //console.error("[v0] Error fetching bank:", error)
    return null
  }
}

// POST requests - Create
export async function createIncome(income: Omit<ApiIncome, "id">): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/income/create`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: income.date,
        income_type: income.income_type,
        amount: income.amount,
        category: income.category,
      }),
    })
    //console.log("[v0] Created income (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error creating income:", error)
    return false
  }
}

export async function createExpense(expense: Omit<ApiExpense, "id">): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/expense/create`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: expense.date,
        payment_type: expense.payment_type,
        amount: expense.amount,
        category: expense.category,
      }),
    })
    //console.log("[v0] Created expense (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error creating expense:", error)
    return false
  }
}

export async function createSaving(saving: Omit<ApiSaving, "id">): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/saving/create`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal: saving.goal,
        income_type: saving.income_type,
        status: saving.status,
        target_amount: saving.target_amount,
        current_amount: saving.current_amount,
      }),
    })
    //console.log("[v0] Created saving (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error creating saving:", error)
    return false
  }
}

// POST requests - Update
export async function updateIncome(income: ApiIncome): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/income/update`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: income.id,
        date: income.date,
        income_type: income.income_type,
        amount: income.amount,
        category: income.category,
      }),
    })
    //console.log("[v0] Updated income (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error updating income:", error)
    return false
  }
}

export async function updateExpense(expense: ApiExpense): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/expense/update`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: expense.id,
        date: expense.date,
        payment_type: expense.payment_type,
        amount: expense.amount,
        category: expense.category,
      }),
    })
    //console.log("[v0] Updated expense (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error updating expense:", error)
    return false
  }
}

export async function updateSaving(saving: ApiSaving): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/saving/update`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: saving.id,
        goal: saving.goal,
        income_type: saving.income_type,
        status: saving.status,
        target_amount: saving.target_amount,
        current_amount: saving.current_amount,
      }),
    })
    //console.log("[v0] Updated saving (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error updating saving:", error)
    return false
  }
}

export async function updateBank(bank: ApiBank): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/bank/update`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: bank.id,
        cash: bank.cash,
        account: bank.account,
        savings_percentage: bank.savings_percentage,
      }),
    })
    //console.log("[v0] Updated bank (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error updating bank:", error)
    return false
  }
}

// POST requests - Delete
export async function deleteIncome(id: string): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/income/delete`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
    //console.log("[v0] Deleted income (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error deleting income:", error)
    return false
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/expense/delete`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
    //console.log("[v0] Deleted expense (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error deleting expense:", error)
    return false
  }
}

export async function deleteSaving(id: string): Promise<boolean> {
  try {
    const baseUrl = typeof window !== "undefined" ? localStorage.getItem("sessionUrl") : ""
    if (!baseUrl) throw new Error("No API URL configured")

    const response = await fetch(`${baseUrl}?ruta=api/v1/saving/delete`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
    //console.log("[v0] Deleted saving (no-cors mode)")
    return true
  } catch (error) {
    //console.error("[v0] Error deleting saving:", error)
    return false
  }
}
