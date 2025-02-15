"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock function to fetch account details
const fetchAccountDetails = async (accountNumber: string) => {
  // In a real application, this would be an API call
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          accountNumber,
          balance: 5000,
          holderName: "John Doe",
        }),
      500,
    ),
  )
}

export default function HomePage() {
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {

    if (sessionStorage.getItem("reloaded") !== "true") {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const accountNumber = localStorage.getItem("accountNumber")

    if (!isLoggedIn || !accountNumber) {
      router.push("/login")
    } else {
      fetchAccountDetails(accountNumber).then((details) => setAccountDetails(details))
    }
  }, [router])

  if (!accountDetails) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Bem-vindo ao seu painel</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Visão geral da conta</CardTitle>
          <CardDescription>Número de conta: {accountDetails.accountNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Titular da conta: {accountDetails.holderName}</p>
          <p className="text-2xl font-bold mt-2">Saldo: ${accountDetails.balance.toFixed(2)}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href={`/account/id${accountDetails.accountNumber}`} passHref>
          <Button className="w-full">Ver painel completo</Button>
        </Link>
        <Link href={`/dashboard/accountId${accountDetails.accountNumber}`} passHref>
          <Button className="w-full">Ver transações</Button>
        </Link>
        <Link href="/search-accounts" passHref>
          <Button className="w-full">Pesquisar contas</Button>
        </Link>
        <Link href="/create-account" passHref>
          <Button className="w-full">Criar nova conta</Button>
        </Link>
      </div>
    </div>
  )
}

