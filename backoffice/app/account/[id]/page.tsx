"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/back-button"

// Mock data for demonstration
const mockAccount = {
  id: 1,
  accountNumber: "1234567",
  agency: "001",
  holderName: "John Doe",
  holderDocument: "123.456.789-00",
  holderEmail: "john@example.com",
  balance: 1000,
  status: "Active",
}

const mockTransactions = [
  { id: 1, date: "2023-06-01", amount: 100, type: "Deposit", counterpartyDocument: "987.654.321-00" },
  { id: 2, date: "2023-06-02", amount: -50, type: "Withdrawal", counterpartyDocument: "123.456.789-00" },
  // Add more mock transactions as needed
]

export default function AccountDetailsPage({ params }: { params: { id: string } }) {
  const [account, setAccount] = useState(mockAccount)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    counterpartyDocument: "",
    transactionType: "",
  })
  const [newEmail, setNewEmail] = useState("")
  const [blockedAmount, setBlockedAmount] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would fetch filtered transactions from your API
    console.log("Searching with filters:", filters)
  }

  const handleEditEmail = () => {
    // In a real application, you would update the email via your API
    setAccount({ ...account, holderEmail: newEmail })
    toast({
      title: "Email Updated",
      description: `Email has been updated to ${newEmail}`,
    })
  }

  const handleBlockAccount = () => {
    // In a real application, you would call your API to block the account
    setAccount({ ...account, status: "Blocked" })
    toast({
      title: "Account Blocked",
      description: `Account ${account.accountNumber} has been blocked`,
    })
  }

  const handleCloseAccount = () => {
    // In a real application, you would call your API to close the account
    setAccount({ ...account, status: "Closed" })
    toast({
      title: "Account Closed",
      description: `Account ${account.accountNumber} has been closed`,
    })
  }

  const handleBlockAmount = () => {
    // In a real application, you would call your API to block the amount

    if (blockedAmount > account.balance) {
      toast({
        title: "Erro",
        description: `O valor de bloqueio não pode ser maior que o saldo de $${account.balance.toFixed(2)}`,
        variant: "destructive",
      })
      return
    }

    setAccount({ ...account, balance: account.balance - blockedAmount })
    toast({
      title: "Amount Blocked",
      description: `$${blockedAmount} has been blocked from the account`,
    })
  }

  const handleUnblockAmount = () => {
    // In a real application, you would call your API to unblock the amount
    setAccount({ ...account, balance: account.balance + blockedAmount })
    toast({
      title: "Amount Unblocked",
      description: `$${blockedAmount} has been unblocked from the account`,
    })
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <BackButton href="/" />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Detalhes da conta</CardTitle>
          <CardDescription>Número de conta: {account.accountNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Agência</Label>
              <p>{account.agency}</p>
            </div>
            <div>
              <Label>Nome do Titular</Label>
              <p>{account.holderName}</p>
            </div>
            <div>
              <Label>Documento Titular</Label>
              <p>{account.holderDocument}</p>
            </div>
            <div>
              <Label>Email do Titular</Label>
              <p>{account.holderEmail}</p>
            </div>
            <div>
              <Label>Saldo</Label>
              <p>${account.balance.toFixed(2)}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p>{account.status}</p>
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Editar Email</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Email</DialogTitle>
                  <DialogDescription>Insira o novo endereço de e-mail do titular da conta.</DialogDescription>
                </DialogHeader>
                <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Novo endereço de e-mail" />
                <DialogFooter>
                  <Button onClick={handleEditEmail}>Atualizar e-mail</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" onClick={handleBlockAccount}>
              Bloquear conta
            </Button>
            <Button variant="destructive" onClick={handleCloseAccount}>
              Fechar conta
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Quantidade de bloqueio/desbloqueio</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quantidade de bloqueio/desbloqueio</DialogTitle>
                  <DialogDescription>Insira o valor a ser bloqueado ou desbloqueado do saldo da conta.</DialogDescription>
                </DialogHeader>
                <Input
                  type="number"
                  value={blockedAmount}
                  onChange={(e) => setBlockedAmount(Number(e.target.value))}
                  placeholder="Amount"
                />
                <DialogFooter>
                  <Button onClick={handleBlockAmount}>Quantidade de bloqueio</Button>
                  <Button onClick={handleUnblockAmount}>Valor de desbloqueio</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* <h2 className="text-2xl font-bold mb-4">Transações</h2>
      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Data de início</Label>
            <Input id="startDate" name="startDate" type="date" value={filters.startDate} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="endDate">Data de término</Label>
            <Input id="endDate" name="endDate" type="date" value={filters.endDate} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="counterpartyDocument">Documento de Contraparte</Label>
            <Input
              id="counterpartyDocument"
              name="counterpartyDocument"
              value={filters.counterpartyDocument}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="transactionType">Tipo de transação</Label>
            <Input
              id="transactionType"
              name="transactionType"
              value={filters.transactionType}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <Button type="submit">Procurar</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Quantia</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento de Contraparte</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{transaction.counterpartyDocument}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  )
}

