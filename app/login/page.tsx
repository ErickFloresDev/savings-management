"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!apiUrl.trim()) {
        toast({
          title: "Error",
          description: "Please enter an AppsScript URL",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      localStorage.setItem("sessionUrl", apiUrl)
      localStorage.setItem("isAuthenticated", "true")

      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to authenticate. Please check your URL.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Savings Manager</CardTitle>
          <CardDescription className="text-sm">Enter your AppsScript URL to access your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl" className="text-sm">
                AppsScript URL
              </Label>
              <Input
                id="apiUrl"
                type="url"
                placeholder="https://script.google.com/macros/s/..."
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
                className="text-sm"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This URL will be used as your API key to retrieve your financial data
              </p>
            </div>
            <Button type="submit" className="w-full text-sm" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
