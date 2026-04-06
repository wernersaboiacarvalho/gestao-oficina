"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ThirdPartyFormProps {
    initialData?: {
        id: string
        name: string
        phone: string | null
        cnpj: string | null
        serviceType: string | null
    }
    onSubmit: (data: { name: string; phone?: string; cnpj?: string; serviceType?: string }) => Promise<void>
    onCancel: () => void
}

export function ThirdPartyForm({ initialData, onSubmit, onCancel }: ThirdPartyFormProps) {
    const [name, setName] = useState(initialData?.name || "")
    const [phone, setPhone] = useState(initialData?.phone || "")
    const [cnpj, setCnpj] = useState(initialData?.cnpj || "")
    const [serviceType, setServiceType] = useState(initialData?.serviceType || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSubmit({
                name,
                phone: phone || undefined,
                cnpj: cnpj || undefined,
                serviceType: serviceType || undefined,
            })
        } catch {
            setError("Erro ao salvar terceiro")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Nome *</Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="Nome da empresa ou profissional"
                    required
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Telefone</Label>
                <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="(00) 00000-0000"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">CNPJ</Label>
                <Input
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="00.000.000/0000-00"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Tipo de Serviço</Label>
                <Input
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="Ex: Funilaria, Elétrica, Motor..."
                />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-10 rounded-xl" disabled={loading}>
                    Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-10 rounded-xl bg-black text-white hover:bg-zinc-800" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </form>
    )
}
