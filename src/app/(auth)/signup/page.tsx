"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
    const supabase = createClient()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100/50">
                <div className="w-full max-w-sm px-4">
                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 text-center">
                        <div className="mb-4">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <span className="text-xl">✓</span>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold">Cadastro realizado!</h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Verifique seu e-mail para confirmar o cadastro.
                        </p>
                        <Link href="/login" className="mt-6 inline-block">
                            <Button variant="outline" className="h-10 rounded-xl">
                                Voltar para Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-100/50">
            <div className="w-full max-w-sm px-4">
                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Criar Conta</h1>
                        <p className="mt-1 text-sm text-zinc-500">Cadastre-se para começar</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-medium text-zinc-700">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Seu nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                                required
                            />
                        </div>
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
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                                minLength={6}
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
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-zinc-500">Já tem conta? </span>
                        <Link href="/login" className="font-medium text-blue-500 hover:text-blue-600">
                            Fazer login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
