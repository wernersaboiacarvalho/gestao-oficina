"use client"

import { useRef } from "react"

interface ServiceOrder {
    id: string
    status: string
    description: string
    totalAmount: number
    createdAt: string
    vehicle: {
        plate: string
        model: string
        brand: string
        year?: number | null
        customer: {
            name: string
            phone?: string
        }
    }
    mechanics: { mechanic: { name: string } }[]
    items: { type: string; description: string; quantity: number; unitPrice: number }[]
}

interface Props {
    order: ServiceOrder
    type: "OS" | "ORCAMENTO"
}

export function PrintPreview({ order, type }: Props) {
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("pt-BR")
    }

    const statusLabel = {
        ORCAMENTO: "Orçamento",
        OPEN: "Ordem de Serviço",
        IN_PROGRESS: "Em Andamento",
        WAITING_PARTS_THIRD_PARTY: "Aguardando Peças",
        DONE: "Concluída",
        BILLED: "Faturada",
        CANCELLED: "Cancelada",
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {type === "ORCAMENTO" ? "Orçamento" : "Ordem de Serviço"}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 text-sm font-medium"
                        >
                            Imprimir / Salvar PDF
                        </button>
                        <button
                            onClick={() => window.close()}
                            className="px-4 py-2 border rounded-lg hover:bg-zinc-50 text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>

                <div className="p-8 print:p-4" id="print-area">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <img 
                                src="/logo.jpg" 
                                alt="Logo" 
                                className="h-16 mb-2" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                }}
                            />
                            <h1 className="text-xl font-bold text-zinc-900">Martins Car</h1>
                            <p className="text-sm text-zinc-600">Serviço de Mecânica Automotiva</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-zinc-600">
                                <span className="font-medium">{type === "ORCAMENTO" ? "Orçamento" : "Ordem de Serviço"}</span>
                                <br />
                                N° {order.id.slice(-6).toUpperCase()}
                            </p>
                            <p className="text-sm text-zinc-600 mt-1">
                                Data: {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-b py-4 mb-6">
                        <h3 className="font-semibold text-zinc-900 mb-3">Dados do Cliente</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-zinc-600">Nome:</p>
                                <p className="font-medium">{order.vehicle.customer.name}</p>
                            </div>
                            <div>
                                <p className="text-zinc-600">Telefone:</p>
                                <p className="font-medium">{order.vehicle.customer.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b pb-4 mb-6">
                        <h3 className="font-semibold text-zinc-900 mb-3">Dados do Veículo</h3>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-zinc-600">Placa:</p>
                                <p className="font-medium">{order.vehicle.plate}</p>
                            </div>
                            <div>
                                <p className="text-zinc-600">Marca:</p>
                                <p className="font-medium">{order.vehicle.brand}</p>
                            </div>
                            <div>
                                <p className="text-zinc-600">Modelo:</p>
                                <p className="font-medium">{order.vehicle.model}</p>
                            </div>
                            <div>
                                <p className="text-zinc-600">Ano:</p>
                                <p className="font-medium">{order.vehicle.year || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {type === "ORCAMENTO" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-blue-600">Validade:</p>
                                    <p className="font-medium">7 dias</p>
                                </div>
                                <div>
                                    <p className="text-blue-600">Forma de Pagamento:</p>
                                    <p className="font-medium">À combinar</p>
                                </div>
                                <div>
                                    <p className="text-blue-600">Garantia:</p>
                                    <p className="font-medium">90 dias</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-semibold text-zinc-900 mb-3">
                            {type === "ORCAMENTO" ? "Itens do Orçamento" : "Serviços e Peças"}
                        </h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 text-zinc-600">Descrição</th>
                                    <th className="text-center py-2 text-zinc-600 w-16">Qtd</th>
                                    <th className="text-right py-2 text-zinc-600 w-28">Valor Unit.</th>
                                    <th className="text-right py-2 text-zinc-600 w-28">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">
                                            <span className={`px-2 py-0.5 rounded text-xs mr-2 ${
                                                item.type === "SERVICE" 
                                                    ? "bg-blue-100 text-blue-700" 
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                                {item.type === "SERVICE" ? "Serviço" : "Peça"}
                                            </span>
                                            {item.description}
                                        </td>
                                        <td className="py-2 text-center">{item.quantity}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                        <td className="py-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-zinc-100 rounded-lg p-4 w-64">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-zinc-600">Subtotal:</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {order.description && (
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-medium text-zinc-900 mb-2">Observações:</h4>
                            <p className="text-sm text-zinc-600">{order.description}</p>
                        </div>
                    )}

                    <div className="mt-8 pt-4 border-t text-center text-xs text-zinc-400">
                        <p>Obrigado pela confiança!</p>
                        <p>Martins Car - Todos os direitos reservados</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 20px;
                    }
                    @page {
                        size: A4;
                        margin: 10mm;
                    }
                }
            `}</style>
        </div>
    )
}
