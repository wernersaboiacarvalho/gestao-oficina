"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThirdPartyForm } from "./third-party-form"
import { createThirdParty, updateThirdParty, deleteThirdParty } from "@/actions/third-parties"

interface ThirdParty {
    id: string
    name: string
    phone: string | null
    cnpj: string | null
    serviceType: string | null
}

interface ThirdPartiesListProps {
    initialThirdParties: ThirdParty[]
}

export function ThirdPartiesList({ initialThirdParties }: ThirdPartiesListProps) {
    const [thirdParties, setThirdParties] = useState(initialThirdParties)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingThirdParty, setEditingThirdParty] = useState<ThirdParty | null>(null)
    const [search, setSearch] = useState("")
    const [, startTransition] = useTransition()

    const filteredThirdParties = thirdParties.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
        t.cnpj?.includes(search)
    )

    const handleCreate = async (data: { name: string; phone?: string; cnpj?: string; serviceType?: string }) => {
        const newThirdParty = await createThirdParty(data)
        setThirdParties([newThirdParty, ...thirdParties])
        setIsModalOpen(false)
    }

    const handleUpdate = async (data: { name: string; phone?: string; cnpj?: string; serviceType?: string }) => {
        if (!editingThirdParty) return
        const updated = await updateThirdParty(editingThirdParty.id, data)
        setThirdParties(thirdParties.map((t) => t.id === editingThirdParty.id ? updated : t))
        setEditingThirdParty(null)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este terceiro?")) {
            startTransition(async () => {
                await deleteThirdParty(id)
                setThirdParties(thirdParties.filter((t) => t.id !== id))
            })
        }
    }

    const openEdit = (thirdParty: ThirdParty) => {
        setEditingThirdParty(thirdParty)
        setIsModalOpen(true)
    }

    const openCreate = () => {
        setEditingThirdParty(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingThirdParty(null)
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-4 p-4 border-b">
                    <Input
                        placeholder="Buscar por nome, tipo de serviço ou CNPJ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs h-9 rounded-lg bg-zinc-50 border-zinc-200"
                    />
                    <Button onClick={openCreate} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800">
                        + Novo Terceiro
                    </Button>
                </div>

                {filteredThirdParties.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {search ? "Nenhum terceiro encontrado" : "Nenhum terceiro cadastrado"}
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredThirdParties.map((thirdParty) => (
                            <div key={thirdParty.id} className="flex items-center justify-between p-4 hover:bg-zinc-50/50">
                                <div>
                                    <p className="font-medium">{thirdParty.name}</p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        {thirdParty.phone && <span>{thirdParty.phone}</span>}
                                        {thirdParty.cnpj && <span>CNPJ: {thirdParty.cnpj}</span>}
                                        {thirdParty.serviceType && <span className="px-2 py-0.5 bg-zinc-100 rounded-full text-xs">{thirdParty.serviceType}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEdit(thirdParty)} className="h-8 rounded-lg text-xs">
                                        Editar
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(thirdParty.id)} className="h-8 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
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
                            {editingThirdParty ? "Editar Terceiro" : "Novo Terceiro"}
                        </h2>
                        <ThirdPartyForm
                            initialData={editingThirdParty ? {
                                ...editingThirdParty,
                                phone: editingThirdParty.phone || null,
                                cnpj: editingThirdParty.cnpj || null,
                                serviceType: editingThirdParty.serviceType || null,
                            } : undefined}
                            onSubmit={editingThirdParty ? handleUpdate : handleCreate}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
