"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VehicleForm } from "./vehicle-form"
import { createVehicle, updateVehicle, deleteVehicle } from "@/actions/vehicles"

interface Vehicle {
    id: string
    customerId: string
    plate: string
    model: string
    brand: string
    year: number | null
    color: string | null
    km: number | null
    customer: { id: string; name: string }
}

interface VehiclesListProps {
    initialVehicles: Vehicle[]
    customers: { id: string; name: string }[]
}

export function VehiclesList({ initialVehicles, customers }: VehiclesListProps) {
    const [vehicles, setVehicles] = useState(initialVehicles)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [search, setSearch] = useState("")
    const [, startTransition] = useTransition()

    const filteredVehicles = vehicles.filter((v) =>
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.customer.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleCreate = async (data: { customerId: string; plate: string; model: string; brand: string; year?: number; color?: string; km?: number }) => {
        const newVehicle = await createVehicle(data)
        setVehicles([{ ...newVehicle, customer: customers.find(c => c.id === data.customerId)! }, ...vehicles])
        setIsModalOpen(false)
    }

    const handleUpdate = async (data: { customerId: string; plate: string; model: string; brand: string; year?: number; color?: string; km?: number }) => {
        if (!editingVehicle) return
        const updated = await updateVehicle(editingVehicle.id, data)
        setVehicles(vehicles.map((v) => v.id === editingVehicle.id ? { ...updated, customer: customers.find(c => c.id === data.customerId)! } : v))
        setEditingVehicle(null)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este veículo?")) {
            startTransition(async () => {
                await deleteVehicle(id)
                setVehicles(vehicles.filter((v) => v.id !== id))
            })
        }
    }

    const openEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle)
        setIsModalOpen(true)
    }

    const openCreate = () => {
        setEditingVehicle(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingVehicle(null)
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-4 p-4 border-b">
                    <Input
                        placeholder="Buscar por placa, modelo ou cliente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs h-9 rounded-lg bg-zinc-50 border-zinc-200"
                    />
                    <Button onClick={openCreate} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800">
                        + Novo Veículo
                    </Button>
                </div>

                {filteredVehicles.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {search ? "Nenhum veículo encontrado" : "Nenhum veículo cadastrado"}
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="flex items-center justify-between p-4 hover:bg-zinc-50/50">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{vehicle.plate}</p>
                                        <span className="text-sm text-muted-foreground">
                                            {vehicle.brand} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{vehicle.customer.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(vehicle)}
                                        className="h-8 rounded-lg text-xs"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(vehicle.id)}
                                        className="h-8 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 m-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingVehicle ? "Editar Veículo" : "Novo Veículo"}
                        </h2>
                        <VehicleForm
                            initialData={editingVehicle || undefined}
                            customers={customers}
                            onSubmit={editingVehicle ? handleUpdate : handleCreate}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
