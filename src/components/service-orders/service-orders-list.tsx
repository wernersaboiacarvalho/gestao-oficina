"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ServiceOrderForm } from "./service-order-form"
import { PrintPreview } from "@/components/pdf/print-preview"
import { createServiceOrder, updateServiceOrder, deleteServiceOrder, updateServiceOrderStatus } from "@/actions/service-orders"

interface Vehicle {
    id: string
    plate: string
    model: string
    brand: string
    customer: { id: string; name: string; phone?: string }
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

interface ServiceOrder {
    id: string
    vehicleId: string
    status: string
    description: string
    isOutsourced: boolean
    totalAmount: number
    createdAt: string
    vehicle: Vehicle
    mechanics: { mechanic: { id: string; name: string } }[]
    thirdParty?: { id: string; name: string } | null
    items: { id: string; type: string; description: string; quantity: number; unitPrice: number }[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
    ORCAMENTO: { label: "Orçamento", color: "bg-indigo-100 text-indigo-700" },
    OPEN: { label: "Aberta", color: "bg-blue-100 text-blue-700" },
    IN_PROGRESS: { label: "Em Andamento", color: "bg-yellow-100 text-yellow-700" },
    WAITING_PARTS_THIRD_PARTY: { label: "Aguardando", color: "bg-orange-100 text-orange-700" },
    DONE: { label: "Concluída", color: "bg-green-100 text-green-700" },
    BILLED: { label: "Faturada", color: "bg-purple-100 text-purple-700" },
    CANCELLED: { label: "Cancelada", color: "bg-red-100 text-red-700" },
}

interface ServiceOrdersListProps {
    initialOrders: ServiceOrder[]
    vehicles: Vehicle[]
    mechanics: Mechanic[]
    thirdParties: ThirdParty[]
    products: Product[]
}

export function ServiceOrdersList({ initialOrders, vehicles, mechanics, thirdParties, products }: ServiceOrdersListProps) {
    const [orders, setOrders] = useState(initialOrders)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState<ServiceOrder | null>(null)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [printingOrder, setPrintingOrder] = useState<ServiceOrder | null>(null)
    const [, startTransition] = useTransition()

    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            o.vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
            o.vehicle.customer.name.toLowerCase().includes(search.toLowerCase()) ||
            o.description.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = !filterStatus || o.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const handleCreate = async (data: {
        vehicleId: string
        status: string
        description: string
        isOutsourced: boolean
        thirdPartyId?: string
        mechanicIds: string[]
        items: ServiceOrderItem[]
    }) => {
        const newOrder = await createServiceOrder({
            ...data,
            items: data.items.map(i => ({ ...i, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
        }) as any
        setOrders([{
            id: newOrder.id,
            vehicleId: newOrder.vehicleId,
            status: newOrder.status,
            description: newOrder.description,
            isOutsourced: newOrder.isOutsourced,
            totalAmount: Number(newOrder.totalAmount),
            createdAt: newOrder.createdAt.toString(),
            vehicle: {
                id: newOrder.vehicle.id,
                plate: newOrder.vehicle.plate,
                model: newOrder.vehicle.model,
                brand: newOrder.vehicle.brand,
                customer: { id: newOrder.vehicle.customer.id, name: newOrder.vehicle.customer.name, phone: newOrder.vehicle.customer.phone },
            },
            mechanics: newOrder.mechanics.map((m: any) => ({ mechanic: { id: m.mechanic.id, name: m.mechanic.name } })),
            items: newOrder.items.map((i: any) => ({ id: i.id, type: i.type, description: i.description, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
        }, ...orders])
        setIsModalOpen(false)
    }

    const handleUpdate = async (data: {
        vehicleId: string
        status: string
        description: string
        isOutsourced: boolean
        thirdPartyId?: string
        mechanicIds: string[]
        items: ServiceOrderItem[]
    }) => {
        if (!editingOrder) return
        const updated = await updateServiceOrder(editingOrder.id, {
            ...data,
            status: data.status as any,
            items: data.items.map(i => ({ ...i, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
        }) as any
        setOrders(orders.map((o) => o.id === editingOrder.id ? {
            id: updated.id,
            vehicleId: updated.vehicleId,
            status: updated.status,
            description: updated.description,
            isOutsourced: updated.isOutsourced,
            totalAmount: Number(updated.totalAmount),
            createdAt: updated.createdAt.toString(),
            vehicle: {
                id: updated.vehicle.id,
                plate: updated.vehicle.plate,
                model: updated.vehicle.model,
                brand: updated.vehicle.brand,
                customer: { id: updated.vehicle.customer.id, name: updated.vehicle.customer.name, phone: updated.vehicle.customer.phone },
            },
            mechanics: updated.mechanics.map((m: any) => ({ mechanic: { id: m.mechanic.id, name: m.mechanic.name } })),
            items: updated.items.map((i: any) => ({ id: i.id, type: i.type, description: i.description, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
        } : o))
        setEditingOrder(null)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Deseja realmente excluir esta ordem de serviço?")) {
            startTransition(async () => {
                await deleteServiceOrder(id)
                setOrders(orders.filter((o) => o.id !== id))
            })
        }
    }

    const handleStatusChange = (id: string, newStatus: string) => {
        startTransition(async () => {
            await updateServiceOrderStatus(id, newStatus as any)
            setOrders(orders.map((o) => o.id === id ? { ...o, status: newStatus } : o))
        })
    }

    const handleApprove = (id: string) => {
        if (confirm("Aprovar este orçamento e criar OS?")) {
            handleStatusChange(id, "OPEN")
        }
    }

    const handleReject = (id: string) => {
        if (confirm("Rejeitar este orçamento?")) {
            handleStatusChange(id, "CANCELLED")
        }
    }

    const openEdit = (order: ServiceOrder) => {
        setEditingOrder(order)
        setIsModalOpen(true)
    }

    const openCreate = () => {
        setEditingOrder(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingOrder(null)
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-4 p-4 border-b flex-wrap">
                    <Input
                        placeholder="Buscar por placa, cliente ou descrição..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs h-9 rounded-lg bg-zinc-50 border-zinc-200"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm"
                    >
                        <option value="">Todos os status</option>
                        {Object.entries(statusConfig).map(([value, config]) => (
                            <option key={value} value={value}>{config.label}</option>
                        ))}
                    </select>
                    <Button onClick={openCreate} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800 ml-auto">
                        + Nova OS
                    </Button>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {search || filterStatus ? "Nenhuma OS encontrada" : "Nenhuma ordem de serviço"}
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredOrders.map((order) => {
                            const config = statusConfig[order.status] || statusConfig.OPEN
                            const isOrcamento = order.status === "ORCAMENTO"
                            
                            return (
                                <div key={order.id} className="p-4 hover:bg-zinc-50/50">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                {order.isOutsourced && (
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                                                        Terceirizado
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-medium mt-1">{order.vehicle.plate}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.vehicle.brand} {order.vehicle.model} • {order.vehicle.customer.name}
                                            </p>
                                            {order.description && (
                                                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{order.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>Mecânicos: {order.mechanics.map(m => m.mechanic.name).join(", ") || "Nenhum"}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                R$ {Number(order.totalAmount).toFixed(2).replace(".", ",")}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="h-7 rounded-lg border border-zinc-200 bg-white px-2 text-xs"
                                                >
                                                    {Object.entries(statusConfig).map(([value, cfg]) => (
                                                        <option key={value} value={value}>{cfg.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex gap-1 mt-2 justify-end flex-wrap">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => setPrintingOrder(order)} 
                                                    className="h-7 rounded-lg text-xs"
                                                >
                                                    PDF
                                                </Button>
                                                {isOrcamento ? (
                                                    <>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleApprove(order.id)} 
                                                            className="h-7 rounded-lg text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        >
                                                            Aprovar
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleReject(order.id)} 
                                                            className="h-7 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            Rejeitar
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => openEdit(order)} 
                                                        className="h-7 rounded-lg text-xs"
                                                    >
                                                        Editar
                                                    </Button>
                                                )}
                                                {!isOrcamento && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        onClick={() => handleDelete(order.id)} 
                                                        className="h-7 rounded-lg text-xs text-red-500 hover:text-red-600"
                                                    >
                                                        Excluir
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto py-8">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 m-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingOrder ? "Editar OS" : "Nova Ordem de Serviço"}
                        </h2>
                        <ServiceOrderForm
                            initialData={editingOrder ? {
                                id: editingOrder.id,
                                vehicleId: editingOrder.vehicleId,
                                status: editingOrder.status,
                                description: editingOrder.description,
                                isOutsourced: editingOrder.isOutsourced,
                                thirdPartyId: editingOrder.thirdParty?.id,
                                mechanicIds: editingOrder.mechanics.map((m: any) => m.mechanic.id),
                                items: editingOrder.items.map((i: any) => ({ type: i.type as "PART" | "SERVICE", description: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
                            } : undefined}
                            vehicles={vehicles}
                            mechanics={mechanics}
                            thirdParties={thirdParties}
                            products={products}
                            onSubmit={editingOrder ? handleUpdate : handleCreate}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}

            {printingOrder && (
                <PrintPreview 
                    order={printingOrder} 
                    type={printingOrder.status === "ORCAMENTO" ? "ORCAMENTO" : "OS"} 
                    onClose={() => setPrintingOrder(null)}
                />
            )}
        </>
    )
}
