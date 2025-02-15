"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/back-button"

// Mock data
const mockAccount = {
  id: "1",
  accountNumber: "1234567",
  agency: "001",
  holderName: "John Doe",
  holderDocument: "123.456.789-00",
  balance: 5000,
  bankCode: "001",
}

const mockTransactions = [
  {
    id: "1",
    date: "2023-06-10",
    amount: 1000,
    type: "Deposit",
    counterpartyDocument: "987.654.321-00",
    description: "Salary",
  },
  {
    id: "2",
    date: "2023-06-09",
    amount: -50,
    type: "Transfer",
    counterpartyDocument: "111.222.333-44",
    description: "Payment to friend",
  },
  {
    id: "3",
    date: "2023-06-08",
    amount: -200,
    type: "Withdrawal",
    counterpartyDocument: "123.456.789-00",
    description: "ATM Withdrawal",
  },
  // Add more mock transactions as needed
]

// Mock function to simulate fetching account details
const fetchAccountDetails = async (accountId: string) => {
  // In a real application, this would be an API call
  return new Promise((resolve) => setTimeout(() => resolve(mockAccount), 500))
}

// Mock function to simulate fetching transactions
const fetchTransactions = async (accountId: string, filters: any) => {
  // In a real application, this would be an API call with proper filtering
  return new Promise((resolve) => setTimeout(() => resolve(mockTransactions), 500))
}

// Mock function to simulate making a transfer
const makeTransfer = async (fromAccount: string, toAccount: string, amount: number) => {
  // In a real application, this would be an API call
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500))
}

// Mock function to simulate fetching account details for transfer
const fetchAccountForTransfer = async (accountNumber: string) => {
  // In a real application, this would be an API call
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          holderDocument: "111.222.333-44",
          bankCode: "001",
          agency: "002",
        }),
      500,
    ),
  )
}

export default function AccountDashboard({ params }: { params: { accountId: string } }) {
  const [account, setAccount] = useState(mockAccount)
  const [transactions, setTransactions] = useState(mockTransactions)
  const [filters, setFilters] = useState({
    id: "",
    startDate: "",
    endDate: "",
    counterpartyDocument: "",
    transactionType: "",
  })
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [transferDetails, setTransferDetails] = useState({
    toAccount: "",
    amount: "",
    holderDocument: "",
    bankCode: "",
    agency: "",
  })

  useEffect(() => {
    const loadAccountDetails = async () => {
      const accountDetails = await fetchAccountDetails(params.accountId)
      setAccount(accountDetails as any)
    }
    loadAccountDetails()
  }, [params.accountId])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const filteredTransactions = await fetchTransactions(params.accountId, filters)
    setTransactions(filteredTransactions as any)
  }

  const handleTransferDetailsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransferDetails({ ...transferDetails, [name]: value })

    if (name === "toAccount" && value.length === 7) {
      // Assuming account numbers are 7 digits
      const accountDetails = await fetchAccountForTransfer(value)
      setTransferDetails((prev) => ({ ...prev, ...accountDetails }))
    }
  }

  const handleTransfer = async () => {
    const result = await makeTransfer(params.accountId, transferDetails.toAccount, Number(transferDetails.amount))
    if (result.success) {
      toast({
        title: "Transfer Successful",
        description: `$${transferDetails.amount} has been transferred to account ${transferDetails.toAccount}`,
      })
      // Refresh account details and transactions
      const updatedAccount = await fetchAccountDetails(params.accountId)
      setAccount(updatedAccount as any)
      const updatedTransactions = await fetchTransactions(params.accountId, {})
      setTransactions(updatedTransactions as any)
    } else {
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
        <BackButton href="/" />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Painel da conta</CardTitle>
          <CardDescription>Número de conta: {account.accountNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome do Titular</Label>
              <p>{account.holderName}</p>
            </div>
            <div>
              <Label>Documento Titular</Label>
              <p>{account.holderDocument}</p>
            </div>
            <div>
              <Label>Agência</Label>
              <p>{account.agency}</p>
            </div>
            <div>
              <Label>Saldo</Label>
              <p className="text-2xl font-bold">${account.balance.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Faça uma transferência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="toAccount">Para conta</Label>
              <Input
                id="toAccount"
                name="toAccount"
                value={transferDetails.toAccount}
                onChange={handleTransferDetailsChange}
                placeholder="Número da conta do destinatário"
              />
            </div>
            <div>
              <Label htmlFor="amount">Quantia</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={transferDetails.amount}
                onChange={handleTransferDetailsChange}
                placeholder="Valor a transferir"
              />
            </div>
            <div>
              <Label htmlFor="holderDocument">Documento do Titular</Label>
              <Input id="holderDocument" name="holderDocument" value={transferDetails.holderDocument} readOnly />
            </div>
            <div>
              <Label htmlFor="bankCode">Código do Banco</Label>
              <Input id="bankCode" name="bankCode" value={transferDetails.bankCode} readOnly />
            </div>
            <div>
              <Label htmlFor="agency">Agência</Label>
              <Input id="agency" name="agency" value={transferDetails.agency} readOnly />
            </div>
          </div>
          <Button className="mt-4" onClick={handleTransfer}>
            Fazer transferência
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de transações</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID da transação</Label>
                <Input id="id" name="id" value={filters.id} onChange={handleFilterChange} />
              </div>
              <div>
                <Label htmlFor="startDate">Data de início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de término</Label>
                <Input id="endDate" name="endDate" type="date" value={filters.endDate} onChange={handleFilterChange} />
              </div>
              <div>
                <Label htmlFor="counterpartyDocument">Documento de Contraparte</Label>
                <Input
                  id="counterpartyDocument"
                  name="counterpartyDocument"
                  value={filters.counterpartyDocument}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <Label htmlFor="transactionType">Tipo de transação</Label>
                <Select
                  name="transactionType"
                  onValueChange={(value) => handleFilterChange({ target: { name: "transactionType", value } } as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Deposit">Depósito</SelectItem>
                    <SelectItem value="Withdrawal">Cancelamento</SelectItem>
                    <SelectItem value="Transfer">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Pesquisar</Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Quantia</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Documento de Contraparte</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.counterpartyDocument}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedTransaction(transaction)}>
                          Ver detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes da transação</DialogTitle>
                        </DialogHeader>
                        {selectedTransaction && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>ID da transação</Label>
                              <p>{selectedTransaction.id}</p>
                            </div>
                            <div>
                              <Label>Data</Label>
                              <p>{selectedTransaction.date}</p>
                            </div>
                            <div>
                              <Label>Quantia</Label>
                              <p>${selectedTransaction.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <Label>Tipo</Label>
                              <p>{selectedTransaction.type}</p>
                            </div>
                            <div>
                              <Label>Documento de Contraparte</Label>
                              <p>{selectedTransaction.counterpartyDocument}</p>
                            </div>
                            <div>
                              <Label>Descrição</Label>
                              <p>{selectedTransaction.description}</p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

