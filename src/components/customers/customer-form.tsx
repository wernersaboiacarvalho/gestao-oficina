"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomerFormData {
    name: string
    phone: string
    email?: string
    document?: string
    birthday?: string
}

interface CustomerFormProps {
    initialData?: CustomerFormData & { id: string }
    onSubmit: (data: CustomerFormData) => Promise<void>
    onCancel: () => void
}

export function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
    const [formData, setFormData] = useState<CustomerFormData>({
        name: initialData?.name || "",
        phone: initialData?.phone || "",
        email: initialData?.email || "",
        document: initialData?.document || "",
        birthday: initialData?.birthday || "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSubmit(formData)
        } catch {
            setError("Erro ao salvar cliente")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-zinc-700">Nome *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    required
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium text-zinc-700">Telefone *</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="(00) 00000-0000"
                    required
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-zinc-700">E-mail</Label>
                <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="document" className="text-xs font-medium text-zinc-700">CPF/CNPJ</Label>
                <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="birthday" className="text-xs font-medium text-zinc-700">Data de Nascimento</Label>
                <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 h-10 rounded-xl"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-black text-white hover:bg-zinc-800"
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </form>
    )
}
