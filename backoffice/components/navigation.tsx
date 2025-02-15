"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("accountNumber")
    setIsLoggedIn(false)
    router.push("/login")
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          DIW Backoffice
        </Link>
        <div className="space-x-4">
          <Link href="/" passHref>
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/search-accounts" passHref>
            <Button variant="ghost">Pesquisar Contas</Button>
          </Link>
          <Link href="/create-account" passHref>
            <Button variant="ghost">Criar nova conta</Button>
          </Link>
          {isLoggedIn ? (
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

