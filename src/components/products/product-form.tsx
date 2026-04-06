"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductFormProps {
    initialData?: {
        id: string
        name: string
        code: string | null
        stockQuantity: number
        costPrice: number
        salePrice: number
    }
    onSubmit: (data: { name: string; code?: string; stockQuantity?: number; costPrice: number; salePrice: number }) => Promise<void>
    onCancel: () => void
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
    const [name, setName] = useState(initialData?.name || "")
    const [code, setCode] = useState(initialData?.code || "")
    const [stockQuantity, setStockQuantity] = useState(initialData?.stockQuantity?.toString() || "0")
    const [costPrice, setCostPrice] = useState(initialData?.costPrice?.toString() || "")
    const [salePrice, setSalePrice] = useState(initialData?.salePrice?.toString() || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSubmit({
                name,
                code: code || undefined,
                stockQuantity: parseInt(stockQuantity) || 0,
                costPrice: parseFloat(costPrice.replace(",", ".")) || 0,
                salePrice: parseFloat(salePrice.replace(",", ".")) || 0,
            })
        } catch {
            setError("Erro ao salvar produto")
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (value: string) => {
        const num = value.replace(/\D/g, "")
        return num ? (parseInt(num) / 100).toFixed(2).replace(".", ",") : ""
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Nome *</Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="Nome do produto/peça"
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Código</Label>
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="Código interno"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Estoque Atual</Label>
                    <Input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="0"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Preço de Custo</Label>
                    <Input
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="0,00"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Preço de Venda</Label>
                    <Input
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="0,00"
                    />
                </div>
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
