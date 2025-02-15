"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Mock function to validate account number
const validateAccount = async (accountNumber: string) => {
  // In a real application, this would be an API call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demonstration, let's say any 7-digit number is valid
      resolve(accountNumber.length === 7)
    }, 500)
  })
}

export default function LoginPage() {
  const [accountNumber, setAccountNumber] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const isValid = await validateAccount(accountNumber)
      if (isValid) {
        // In a real application, you would set an authentication token here
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("accountNumber", accountNumber)
        // Redirect to the main page
        router.push("/")
      } else {
        toast({
          title: "Invalid Account",
          description: "Please enter a valid 7-digit account number.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error validating account:", error)
      toast({
        title: "Error",
        description: "An error occurred while validating your account. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Bank Backoffice</CardTitle>
          <CardDescription>Please enter your account number to log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your 7-digit account number"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

