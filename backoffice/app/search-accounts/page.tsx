"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { BackButton } from "@/components/back-button"

// Mock data for demonstration
const mockAccounts = [
  { id: 1, accountNumber: "1234567", agency: "001", holderDocument: "123.456.789-00", balance: 1000 },
  { id: 2, accountNumber: "7654321", agency: "002", holderDocument: "987.654.321-00", balance: 2000 },
  { id: 3, accountNumber: "1478523", agency: "003", holderDocument: "111.222.333-00", balance: 3000 },
  // Add more mock accounts as needed
]

export default function SearchAccountsPage() {
  const [filters, setFilters] = useState({
    accountNumber: "",
    agency: "",
    holderDocument: "",
  })
  const [filteredAccounts, setFilteredAccounts] = useState(mockAccounts)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = mockAccounts.filter(
      (account) =>
        (!filters.accountNumber || account.accountNumber.includes(filters.accountNumber)) &&
        (!filters.agency || account.agency.includes(filters.agency)) &&
        (!filters.holderDocument || account.holderDocument.includes(filters.holderDocument)),
    )
    setFilteredAccounts(filtered)
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <BackButton href="/" />
      <h1 className="text-2xl font-bold mb-5">Pesquisar contas bancárias</h1>
      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="accountNumber">Número de conta</Label>
            <Input id="accountNumber" name="accountNumber" value={filters.accountNumber} onChange={handleInputChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="agency">Agência</Label>
            <Input id="agency" name="agency" value={filters.agency} onChange={handleInputChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="holderDocument">Documento do Titular</Label>
            <Input
              id="holderDocument"
              name="holderDocument"
              value={filters.holderDocument}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <Button type="submit">Procurar</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número de conta</TableHead>
            <TableHead>Agência</TableHead>
            <TableHead>Documento do Titular</TableHead>
            <TableHead>Saldo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.accountNumber}</TableCell>
              <TableCell>{account.agency}</TableCell>
              <TableCell>{account.holderDocument}</TableCell>
              <TableCell>${account.balance.toFixed(2)}</TableCell>
              <TableCell>
                <Link href={`dashboard/account${account.id}`} className="text-blue-600 hover:underline">
                Ver detalhes
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

