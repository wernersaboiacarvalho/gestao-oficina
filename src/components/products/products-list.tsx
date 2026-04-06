"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductForm } from "./product-form"
import { createProduct, updateProduct, deleteProduct } from "@/actions/products"

interface Product {
    id: string
    name: string
    code: string | null
    stockQuantity: number
    costPrice: number
    salePrice: number
}

interface ProductsListProps {
    initialProducts: Product[]
}

export function ProductsList({ initialProducts }: ProductsListProps) {
    const [products, setProducts] = useState(initialProducts)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [search, setSearch] = useState("")
    const [, startTransition] = useTransition()

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code?.toLowerCase().includes(search.toLowerCase())
    )

    const handleCreate = async (data: { name: string; code?: string; stockQuantity?: number; costPrice: number; salePrice: number }) => {
        const newProduct = await createProduct(data) as any
        setProducts([{ ...newProduct, costPrice: Number(newProduct.costPrice), salePrice: Number(newProduct.salePrice) }, ...products])
        setIsModalOpen(false)
    }

    const handleUpdate = async (data: { name: string; code?: string; stockQuantity?: number; costPrice: number; salePrice: number }) => {
        if (!editingProduct) return
        const updated = await updateProduct(editingProduct.id, data) as any
        setProducts(products.map((p) => p.id === editingProduct.id ? { ...updated, costPrice: Number(updated.costPrice), salePrice: Number(updated.salePrice) } : p))
        setEditingProduct(null)
        setIsModalOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este produto?")) {
            startTransition(async () => {
                await deleteProduct(id)
                setProducts(products.filter((p) => p.id !== id))
            })
        }
    }

    const openEdit = (product: Product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const openCreate = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setEditingProduct(null)
        setIsModalOpen(false)
    }

    const formatCurrency = (value: number) => {
        return value.toFixed(2).replace(".", ",")
    }

    const getMargin = (cost: number, sale: number) => {
        if (cost === 0) return "0%"
        return (((sale - cost) / cost) * 100).toFixed(0) + "%"
    }

    return (
        <>
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center gap-4 p-4 border-b">
                    <Input
                        placeholder="Buscar por nome ou código..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-xs h-9 rounded-lg bg-zinc-50 border-zinc-200"
                    />
                    <Button onClick={openCreate} className="h-9 rounded-lg bg-black text-white hover:bg-zinc-800">
                        + Novo Produto
                    </Button>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        {search ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-xs text-muted-foreground">
                                    <th className="px-4 py-3 font-medium">Produto</th>
                                    <th className="px-4 py-3 font-medium">Código</th>
                                    <th className="px-4 py-3 font-medium text-center">Estoque</th>
                                    <th className="px-4 py-3 font-medium text-right">Custo</th>
                                    <th className="px-4 py-3 font-medium text-right">Venda</th>
                                    <th className="px-4 py-3 font-medium text-center">Margem</th>
                                    <th className="px-4 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b last:border-0 hover:bg-zinc-50/50">
                                        <td className="px-4 py-3 font-medium">{product.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{product.code || "-"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                product.stockQuantity <= 0 
                                                    ? "bg-red-100 text-red-700" 
                                                    : product.stockQuantity <= 5 
                                                        ? "bg-yellow-100 text-yellow-700" 
                                                        : "bg-green-100 text-green-700"
                                            }`}>
                                                {product.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">R$ {formatCurrency(product.costPrice)}</td>
                                        <td className="px-4 py-3 text-right text-sm font-medium">R$ {formatCurrency(product.salePrice)}</td>
                                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{getMargin(product.costPrice, product.salePrice)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(product)} className="h-7 rounded-lg text-xs">
                                                    Editar
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)} className="h-7 rounded-lg text-xs text-red-500 hover:text-red-600">
                                                    Excluir
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 m-4">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingProduct ? "Editar Produto" : "Novo Produto"}
                        </h2>
                        <ProductForm
                            initialData={editingProduct || undefined}
                            onSubmit={editingProduct ? handleUpdate : handleCreate}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </>
    )
}
