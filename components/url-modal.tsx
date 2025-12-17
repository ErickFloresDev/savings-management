"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface UrlModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUrlSaved: () => void
}

export function UrlModal({ open, onOpenChange, onUrlSaved }: UrlModalProps) {
  const [apiUrl, setApiUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      // Load current URL when modal opens
      const currentUrl = localStorage.getItem("sessionUrl") || ""
      setApiUrl(currentUrl)
    }
  }, [open])

  const handleSave = () => {
    setIsLoading(true)

    try {
      if (!apiUrl.trim()) {
        toast({
          title: "Error",
          description: "Please enter a valid AppsScript URL",
        })
        setIsLoading(false)
        return
      }

      // Validate URL format
      try {
        new URL(apiUrl)
      } catch {
        toast({
          title: "Error",
          description: "Please enter a valid URL",
        })
        setIsLoading(false)
        return
      }

      localStorage.setItem("sessionUrl", apiUrl)

      toast({
        title: "Success",
        description: "API URL saved successfully!",
      })

      onOpenChange(false)
      onUrlSaved()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save URL. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>Enter your Google Apps Script URL to connect to your financial data</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">AppsScript URL</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://script.google.com/macros/s/..."
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This URL will be used to fetch and update your financial data
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save URL"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
