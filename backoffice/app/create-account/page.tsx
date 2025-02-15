"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BackButton } from "@/components/back-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateAccountPage() {
  const [accountData, setAccountData] = useState({
    branch: "",
    bankAccountType: "1",
    holderName: "",
    holderDocument: "",
    holderEmail: "",
    holderType: "1",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setAccountData({ ...accountData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://bank-accounts/api/bank-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: accountData.branch,
          bankAccountType: parseInt(accountData.bankAccountType, 10),
          holderName: accountData.holderName,
          holderEmail: accountData.holderEmail,
          holderDocument: accountData.holderDocument,
          holderType: parseInt(accountData.holderType, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar conta");
      }

      const data = await response.json();

      toast({
        title: "Conta Criada",
        description: `Conta criada com sucesso! ID: ${data.id}`,
      });

      // Resetando os campos após sucesso
      setAccountData({
        branch: "",
        bankAccountType: "1",
        holderName: "",
        holderDocument: "",
        holderEmail: "",
        holderType: "1",
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a conta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <BackButton href="/" />
      <h1 className="text-2xl font-bold mb-5">Criar conta bancária</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="branch">Agência</Label>
          <Input id="branch" name="branch" value={accountData.branch} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="bankAccountType">Tipo de Conta</Label>
          <Select onValueChange={(value) => handleSelectChange("bankAccountType", value)} value={accountData.bankAccountType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Conta Corrente</SelectItem>
              <SelectItem value="2">Conta Poupança</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="holderName">Nome do Titular</Label>
          <Input id="holderName" name="holderName" value={accountData.holderName} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="holderDocument">Documento Titular</Label>
          <Input id="holderDocument" name="holderDocument" value={accountData.holderDocument} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="holderEmail">E-mail do titular</Label>
          <Input id="holderEmail" name="holderEmail" type="email" value={accountData.holderEmail} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="holderType">Tipo de Titular</Label>
          <Select onValueChange={(value) => handleSelectChange("holderType", value)} value={accountData.holderType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de titular" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pessoa Física</SelectItem>
              <SelectItem value="2">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Criar Conta</Button>
      </form>
    </div>
  );
}
