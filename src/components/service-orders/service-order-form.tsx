"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Vehicle {
    id: string
    plate: string
    model: string
    brand: string
    customer: { name: string }
}

interface Mechanic {
    id: string
    name: string
}

interface ThirdParty {
    id: string
    name: string
}

interface Product {
    id: string
    name: string
    code: string | null
    salePrice: number
    stockQuantity: number
}

interface ServiceOrderItem {
    id?: string
    type: "PART" | "SERVICE"
    productId?: string
    description: string
    quantity: number
    unitPrice: number
}

interface ServiceOrderFormProps {
    initialData?: {
        id: string
        vehicleId: string
        status: string
        description: string
        isOutsourced: boolean
        thirdPartyId?: string
        mechanicIds: string[]
        items: ServiceOrderItem[]
    }
    vehicles: Vehicle[]
    mechanics: Mechanic[]
    thirdParties: ThirdParty[]
    products: Product[]
    onSubmit: (data: {
        vehicleId: string
        status: string
        description: string
        isOutsourced: boolean
        thirdPartyId?: string
        mechanicIds: string[]
        items: ServiceOrderItem[]
    }) => Promise<void>
    onCancel: () => void
}

const statusLabels: Record<string, string> = {
    ORCAMENTO: "Orçamento",
    OPEN: "Aberta",
    IN_PROGRESS: "Em Andamento",
    WAITING_PARTS_THIRD_PARTY: "Aguardando Peças/Terceiro",
    DONE: "Concluída",
    BILLED: "Faturada",
    CANCELLED: "Cancelada",
}

export function ServiceOrderForm({ initialData, vehicles, mechanics, thirdParties, products, onSubmit, onCancel }: ServiceOrderFormProps) {
    const [vehicleId, setVehicleId] = useState(initialData?.vehicleId || "")
    const [status, setStatus] = useState(initialData?.status || "ORCAMENTO")
    const [description, setDescription] = useState(initialData?.description || "")
    const [isOutsourced, setIsOutsourced] = useState(initialData?.isOutsourced || false)
    const [thirdPartyId, setThirdPartyId] = useState(initialData?.thirdPartyId || "")
    const [selectedMechanics, setSelectedMechanics] = useState<string[]>(initialData?.mechanicIds || [])
    const [items, setItems] = useState<ServiceOrderItem[]>(initialData?.items || [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const toggleMechanic = (id: string) => {
        setSelectedMechanics(prev =>
            prev.includes(id) ? prev.filter((m: string) => m !== id) : [...prev, id]
        )
    }

    const addItem = () => {
        setItems([...items, { type: "SERVICE", description: "", quantity: 1, unitPrice: 0 }])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_: any, i: number) => i !== index))
    }

    const updateItem = (index: number, field: keyof ServiceOrderItem, value: any) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleProductChange = (index: number, productId: string) => {
        const product = products.find(p => p.id === productId)
        if (product) {
            updateItem(index, "productId", product.id)
            updateItem(index, "description", product.name)
            updateItem(index, "unitPrice", product.salePrice)
            updateItem(index, "quantity", 1)
        }
    }

    const totalAmount = items.reduce((sum: number, item: ServiceOrderItem) => sum + (item.quantity * item.unitPrice), 0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!vehicleId) { setError("Selecione um veículo"); return }
        if (selectedMechanics.length === 0) { setError("Selecione pelo menos um mecânico"); return }
        if (items.length === 0) { setError("Adicione pelo menos um item"); return }
        if (items.some((i: ServiceOrderItem) => !i.description.trim())) { setError("Preencha a descrição de todos os itens"); return }

        setLoading(true)
        setError(null)
        try {
            await onSubmit({
                vehicleId,
                status,
                description,
                isOutsourced,
                thirdPartyId: isOutsourced ? thirdPartyId : undefined,
                mechanicIds: selectedMechanics,
                items: items.filter((i: ServiceOrderItem) => i.description.trim() !== ""),
            })
        } catch {
            setError("Erro ao salvar ordem de serviço")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Veículo *</Label>
                <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:ring-2 focus:ring-ring/50 outline-none"
                    required
                >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.plate} - {v.brand} {v.model} ({v.customer.name})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Descrição / Sintoma</Label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:bg-white focus:ring-2 focus:ring-ring/50 outline-none resize-none"
                    rows={2}
                    placeholder="Descreva o problema relatado pelo cliente..."
                />
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Tipo</Label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white outline-none"
                >
                    <option value="ORCAMENTO">Orçamento</option>
                    <option value="OPEN">Ordem de Serviço</option>
                </select>
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isOutsourced}
                        onChange={(e) => setIsOutsourced(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300"
                    />
                    <span className="text-sm">Serviço Terceirizado</span>
                </label>
            </div>

            {isOutsourced && (
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700">Terceiro</Label>
                    <select
                        value={thirdPartyId}
                        onChange={(e) => setThirdPartyId(e.target.value)}
                        className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white outline-none"
                    >
                        <option value="">Selecione um terceiro</option>
                        {thirdParties.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-2">
                <Label className="text-xs font-medium text-zinc-700">Mecânicos *</Label>
                <div className="flex flex-wrap gap-2">
                    {mechanics.map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleMechanic(m.id)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                selectedMechanics.includes(m.id)
                                    ? "bg-black text-white"
                                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            }`}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-700">Itens (Peças e Serviços) *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 rounded-lg text-xs">
                        + Adicionar
                    </Button>
                </div>

                {items.map((item: ServiceOrderItem, index: number) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-zinc-50 rounded-xl">
                        <select
                            value={item.type}
                            onChange={(e) => {
                                updateItem(index, "type", e.target.value)
                                if (e.target.value === "SERVICE") {
                                    updateItem(index, "description", "")
                                    updateItem(index, "productId", undefined)
                                }
                            }}
                            className="h-8 w-20 rounded-lg border border-zinc-200 bg-white px-2 text-xs"
                        >
                            <option value="SERVICE">Serviço</option>
                            <option value="PART">Peça</option>
                        </select>
                        
                        {item.type === "PART" ? (
                            <select
                                value={item.productId || ""}
                                onChange={(e) => handleProductChange(index, e.target.value)}
                                className="h-8 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-sm"
                            >
                                <option value="">Selecione uma peça...</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - R$ {p.salePrice.toFixed(2).replace(".", ",")} ({p.stockQuantity} und)
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <Input
                                value={item.description}
                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                placeholder="Descrição do serviço"
                                className="h-8 flex-1 rounded-lg bg-white border-zinc-200 text-sm"
                            />
                        )}
                        
                        <Input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                            placeholder="Qtd"
                            min="1"
                            className="h-8 w-16 rounded-lg bg-white border-zinc-200 text-sm text-center"
                        />
                        <Input
                            type="number"
                            value={item.unitPrice || ""}
                            onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            placeholder="Valor"
                            className="h-8 w-24 rounded-lg bg-white border-zinc-200 text-sm"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            ×
                        </Button>
                    </div>
                ))}

                {items.length > 0 && (
                    <div className="flex justify-end">
                        <div className="text-sm font-medium bg-zinc-100 px-3 py-1 rounded-lg">
                            Total: R$ {totalAmount.toFixed(2).replace(".", ",")}
                        </div>
                    </div>
                )}
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
