"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomerForm } from "./customer-form"
import { createCustomer, updateCustomer, deleteCustomer } from "@/actions/customers"

interface Customer {
    id: string
    name: string
    phone: string
    email: string | null
    document: string | null
    birthday: string | null
}

interface CustomersListProps {
    initialCustomers: Customer[]
}

export function CustomersList({ initialCustomers }: CustomersListProps) {
    const [customers, setCustomers] = useState(initialCustomers)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
    const [search, setSearch] = useState("")
    const [, startTransition] = useTransition()

    const filteredCustomers = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    )

    const handleCreate = async (data: { name: string; phone: string; email?: string; document?: string; birthday?: string }) => {
        const newCustomer = await createCustomer(data)
        setCustomers([{ ...newCustomer, birthday: newCustomer.birthday ? newCustomer.birthday.split("T")[0] : null }, ...customers])
        setIsModalOpen(false)
    }

    const handleUpdate = async (data: { name: string; phone: string; email?: string; document?: string; birthday?: string }) => {
        if (!editingCustomer) return
        const updated = await updateCustomer(editingCustomer.id, data)
        setCustomers(customers.map((c) => c.id === editingCustomer.id ? { ...updated, birthday: updated.birthday ? updated.birthday.split("T")[0] : null } : c))
        setEditingCustomer(null)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este cliente?")) {
            startTransition(async () => {
                await deleteCustomer(id)
                setCustomers(customers.filter((c) => c.id !== id))
            })
        }
    }

    const openEdit = (customer: Customer) => {
        setEditingCustomer(customer)
        setIsModalOpen(true)
    }

    const openCreate = () => {
        setEditingCustomer(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingCustomer(null)
        setIsModalOpen(false)
    }

    return (
        <>
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-4 p-4 border-b">
                    <Input
                        placeholder="Buscar por nome ou telefone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs h-9 rounded-lg bg-zinc-50 border-zinc-200"
                    />
                    <Button onClick={openCreate} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800">
                        + Novo Cliente
                    </Button>
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="flex items-center justify-between p-4 hover:bg-zinc-50/50">
                                <div>
                                    <p className="font-medium">{customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEdit(customer)}
                                        className="h-8 rounded-lg text-xs"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(customer.id)}
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
                            {editingCustomer ? "Editar Cliente" : "Novo Cliente"}
                        </h2>
                        <CustomerForm
                            initialData={editingCustomer ? {
                                ...editingCustomer,
                                email: editingCustomer.email || undefined,
                                document: editingCustomer.document || undefined,
                                birthday: editingCustomer.birthday || undefined,
                            } : undefined}
                            onSubmit={editingCustomer ? handleUpdate : handleCreate}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
