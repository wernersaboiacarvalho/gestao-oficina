"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface VehicleFormProps {
    initialData?: {
        id: string
        customerId: string
        plate: string
        model: string
        brand: string
        year: number | null
        color: string | null
        km: number | null
    }
    customers: { id: string; name: string }[]
    onSubmit: (data: {
        customerId: string
        plate: string
        model: string
        brand: string
        year?: number
        color?: string
        km?: number
    }) => Promise<void>
    onCancel: () => void
}

export function VehicleForm({ initialData, customers, onSubmit, onCancel }: VehicleFormProps) {
    const [customerId, setCustomerId] = useState(initialData?.customerId || "")
    const [plate, setPlate] = useState(initialData?.plate || "")
    const [model, setModel] = useState(initialData?.model || "")
    const [brand, setBrand] = useState(initialData?.brand || "")
    const [year, setYear] = useState(initialData?.year?.toString() || "")
    const [color, setColor] = useState(initialData?.color || "")
    const [km, setKm] = useState(initialData?.km?.toString() || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            await onSubmit({
                customerId,
                plate,
                model,
                brand,
                year: year ? parseInt(year) : undefined,
                color: color || undefined,
                km: km ? parseInt(km) : undefined,
            })
        } catch {
            setError("Erro ao salvar veículo")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <Label htmlFor="customerId" className="text-xs font-medium text-zinc-700">Cliente *</Label>
                <select
                    id="customerId"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:ring-2 focus:ring-ring/50 outline-none"
                    required
                >
                    <option value="">Selecione um cliente</option>
                    {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="plate" className="text-xs font-medium text-zinc-700">Placa *</Label>
                    <Input
                        id="plate"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="ABC-1234"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="year" className="text-xs font-medium text-zinc-700">Ano</Label>
                    <Input
                        id="year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="2024"
                    />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="brand" className="text-xs font-medium text-zinc-700">Marca *</Label>
                <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="Volkswagen, Ford, Chevrolet..."
                    required
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="model" className="text-xs font-medium text-zinc-700">Modelo *</Label>
                <Input
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                    placeholder="Gol, Civic, Onix..."
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="color" className="text-xs font-medium text-zinc-700">Cor</Label>
                    <Input
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="Preto, Branco..."
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="km" className="text-xs font-medium text-zinc-700">Quilometragem</Label>
                    <Input
                        id="km"
                        type="number"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        className="h-10 rounded-xl bg-zinc-50 border-zinc-200 focus:bg-white"
                        placeholder="45000"
                    />
                </div>
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
