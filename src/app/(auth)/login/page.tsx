"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100/50">
            <div className="w-full max-w-sm px-4">
                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Gestão de Oficina</h1>
                        <p className="mt-1 text-sm text-zinc-500">Entre para continuar</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-medium text-zinc-700">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-medium text-zinc-700">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button 
                            type="submit" 
                            className="h-10 w-full rounded-xl bg-black text-white hover:bg-zinc-800 active:bg-zinc-900" 
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-zinc-500">Não tem conta? </span>
                        <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-600">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
